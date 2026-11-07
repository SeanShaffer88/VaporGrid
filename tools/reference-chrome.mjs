import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, realpath, rm, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';

const TYPES = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
]);

export async function until(read, description, timeout = 8000) {
  const deadline = Date.now() + timeout;
  do {
    const result = await read();
    if (result) return result;
    await wait(50);
  } while (Date.now() < deadline);
  throw new Error(`Timed out waiting for ${description}.`);
}

async function serve(root) {
  const base = await realpath(root);
  const isInRoot = (filename) => {
    const pathInRoot = relative(base, filename);
    return !isAbsolute(pathInRoot) && pathInRoot !== '..' && !pathInRoot.startsWith(`..${sep}`);
  };
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      const candidate = resolve(base, `.${pathname}`, ...(pathname.endsWith('/') ? ['index.html'] : []));
      if (!isInRoot(candidate) || request.method !== 'GET') {
        response.writeHead(404).end();
        return;
      }
      const filename = await realpath(candidate);
      const type = TYPES.get(extname(filename));
      if (!isInRoot(filename) || !type || !(await stat(filename)).isFile()) {
        response.writeHead(404).end();
        return;
      }
      const content = await readFile(filename);
      response.writeHead(200, {
        'Content-Type': type,
        'Cache-Control': 'no-store',
        'Content-Security-Policy': "default-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'self'; style-src 'self' 'unsafe-inline'",
      }).end(content);
    } catch {
      response.writeHead(404).end();
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return server;
}

function chromeExecutable() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  if (process.platform !== 'win32') return 'google-chrome';
  const roots = [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA];
  for (const root of roots.filter(Boolean)) {
    const filename = join(root, 'Google', 'Chrome', 'Application', 'chrome.exe');
    if (existsSync(filename)) return filename;
  }
  throw new Error('Chrome was not found. Set CHROME_PATH to the Chrome executable.');
}

function validPort(value) {
  const port = Number(value);
  return Number.isInteger(port) && port > 0 && port <= 65535 ? port : undefined;
}

async function connect(url, onEvent) {
  const socket = new WebSocket(url);
  await new Promise((resolveOpen, rejectOpen) => {
    const timer = setTimeout(() => {
      socket.close();
      rejectOpen(new Error('The Chrome debugger connection timed out.'));
    }, 8000);
    socket.addEventListener('open', () => {
      clearTimeout(timer);
      resolveOpen();
    }, { once: true });
    socket.addEventListener('error', (error) => {
      clearTimeout(timer);
      rejectOpen(new Error('The Chrome debugger connection failed.', { cause: error }));
    }, { once: true });
  });
  const pending = new Map();
  let nextId = 0;
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id) {
      onEvent(message);
      return;
    }
    const entry = pending.get(message.id);
    if (!entry) return;
    clearTimeout(entry.timer);
    pending.delete(message.id);
    if (message.error) entry.reject(new Error(`${entry.method}: ${message.error.message}`));
    else entry.resolve(message.result);
  });
  socket.addEventListener('close', () => {
    for (const entry of pending.values()) {
      clearTimeout(entry.timer);
      entry.reject(new Error(`Chrome disconnected during ${entry.method}.`));
    }
    pending.clear();
  });
  return {
    close: () => socket.close(),
    call(method, params = {}) {
      return new Promise((resolveCall, rejectCall) => {
        const id = ++nextId;
        const timer = setTimeout(() => {
          pending.delete(id);
          rejectCall(new Error(`Chrome command timed out: ${method}.`));
        }, 8000);
        pending.set(id, { resolve: resolveCall, reject: rejectCall, method, timer });
        try {
          socket.send(JSON.stringify({ id, method, params }));
        } catch (error) {
          clearTimeout(timer);
          pending.delete(id);
          rejectCall(error);
        }
      });
    },
  };
}

export async function withReferenceChrome(root, test) {
  const tempRoot = await realpath(tmpdir());
  const prefix = 'tessel-reference-';
  const profile = await mkdtemp(join(tempRoot, prefix));
  let server;
  let chrome;
  let session;
  let processDone;
  try {
    server = await serve(root);
    const origin = `http://127.0.0.1:${server.address().port}`;
    chrome = spawn(chromeExecutable(), [
      '--headless', '--remote-debugging-address=127.0.0.1',
      '--remote-debugging-port=0', `--user-data-dir=${profile}`,
      '--disable-background-networking', '--disable-component-update',
      '--disable-default-apps', '--disable-sync', '--no-first-run',
      '--no-default-browser-check', '--no-proxy-server',
      '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1', 'about:blank',
    ], { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
    let processError;
    let announcedPort;
    const browserOutput = { stdout: '', stderr: '' };
    for (const stream of ['stdout', 'stderr']) {
      chrome[stream].setEncoding('utf8');
      chrome[stream].on('data', (text) => {
        const buffer = browserOutput[stream] + text;
        announcedPort ??= validPort(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d{1,5})\/devtools\/browser\//.exec(buffer)?.[1]);
        browserOutput[stream] = buffer.slice(-4000);
      });
    }
    chrome.once('error', (error) => { processError = error; });
    processDone = new Promise((resolveExit) => chrome.once('close', resolveExit));
    let debugPort;
    try {
      debugPort = await until(async () => {
        if (processError) throw new Error(`Chrome could not start: ${processError.message}`);
        if (chrome.exitCode !== null || chrome.signalCode !== null) {
          throw new Error(`Chrome exited during startup (${chrome.exitCode ?? chrome.signalCode}).`);
        }
        const contents = await readFile(join(profile, 'DevToolsActivePort'), 'utf8').catch((error) => {
          if (error.code !== 'ENOENT') throw error;
          return '';
        });
        return validPort(/^\d{1,5}(?=\r?\n)/.exec(contents)?.[0]) ?? announcedPort;
      }, 'the isolated Chrome debugging port', 20000);
    } catch (error) {
      const output = Object.entries(browserOutput)
        .map(([stream, value]) => `${stream}: ${value.trim() || '(empty)'}`).join('\n');
      throw new Error(`${error.message}\nChrome startup output:\n${output}`, { cause: error });
    }
    const discovery = await fetch(`http://127.0.0.1:${debugPort}/json/list`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!discovery.ok) throw new Error(`Chrome debugger discovery failed (HTTP ${discovery.status}).`);
    const targets = await discovery.json();
    const target = targets.find(({ type }) => type === 'page');
    if (!target) throw new Error('Chrome did not expose a page target.');
    const socketUrl = new URL(target.webSocketDebuggerUrl);
    if (socketUrl.origin !== `ws://127.0.0.1:${debugPort}` ||
        socketUrl.username || socketUrl.password || !socketUrl.pathname.startsWith('/devtools/page/')) {
      throw new Error('Chrome did not advertise a loopback page debugger endpoint.');
    }
    const errors = [];
    const requests = [];
    session = await connect(socketUrl, ({ method, params }) => {
      if (method === 'Runtime.exceptionThrown') errors.push(params.exceptionDetails.exception?.description ?? params.exceptionDetails.text);
      if (method === 'Runtime.consoleAPICalled' && params.type === 'error') {
        errors.push(params.args.map((argument) => argument.value ?? argument.description).join(' '));
      }
      if (method === 'Log.entryAdded' && params.entry.source === 'security' && params.entry.level === 'error') {
        errors.push(params.entry.text);
      }
      if (method === 'Network.responseReceived' && params.response.status >= 400 &&
          !params.response.url.endsWith('/favicon.ico')) {
        errors.push(`HTTP ${params.response.status}: ${params.response.url}`);
      }
      if (method === 'Fetch.requestPaused') {
        const { url } = params.request;
        const local = url.startsWith(`${origin}/`);
        requests.push({ url, local });
        session.call(local ? 'Fetch.continueRequest' : 'Fetch.failRequest', {
          requestId: params.requestId,
          ...(local ? {} : { errorReason: 'BlockedByClient' }),
        }).catch((error) => errors.push(error.message));
      }
    });
    const { call } = session;
    await Promise.all([
      call('Runtime.enable'), call('Log.enable'), call('Page.enable'), call('Network.enable'),
      call('Fetch.enable', { patterns: [{ urlPattern: '*' }] }),
    ]);
    const version = await call('Browser.getVersion');
    await test({ call, origin, errors, requests, version: version.product });
  } finally {
    let exited = !processDone;
    if (session) {
      // The debugger socket may close before Chrome returns a response.
      await session.call('Browser.close').catch(() => {});
      session.close();
    }
    try {
      if (processDone) {
        const shutdownDeadline = new AbortController();
        const timeout = () => wait(3000, false, { signal: shutdownDeadline.signal }).catch(() => false);
        try {
          const processExit = processDone.then(() => true);
          exited = await Promise.race([processExit, timeout()]);
          if (!exited) {
            chrome.kill();
            exited = await Promise.race([processExit, timeout()]);
          }
        } finally {
          shutdownDeadline.abort();
        }
      }
    } finally {
      server?.closeAllConnections();
      server?.close();
      if (!exited) throw new Error('The isolated Chrome process did not exit. Profile cleanup was stopped.');
      const resolvedProfile = await realpath(profile);
      if (resolvedProfile !== profile || dirname(resolvedProfile) !== tempRoot ||
          !basename(resolvedProfile).startsWith(prefix)) {
        throw new Error('The isolated Chrome profile path changed. Cleanup was stopped.');
      }
      await rm(resolvedProfile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    }
  }
}
