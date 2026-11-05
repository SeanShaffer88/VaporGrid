// VaporGrid tooltip contract, reference implementation. Every [data-tip] element gets a tooltip that never covers
// text, controls, fields, icons or focus rings. If no clear position exists, the text goes to the nearest hint lane
// ([data-hint-lane]: the window's status lane, or the open dialog's own lane) instead of overlaying content.
import { placeTooltip, rect, inflate, intersects, tooltipTiming } from './tooltip-placement.mjs';

const OBSTACLES = 'button,a[href],input,select,textarea,progress,output,[role=separator],svg,img,kbd,.status,.badge,[contenteditable]';
const IDLE_HINT = 'Hover or focus any control for help.';
const supportsPopover = typeof HTMLElement !== 'undefined' && Object.hasOwn(HTMLElement.prototype, 'popover');
const toRect = r => rect(r.left, r.top, r.width, r.height);

export function installTooltips(doc = document) {
  const tip = doc.createElement('div');
  tip.id = 'vg-tooltip';
  tip.className = 'tooltip';
  tip.setAttribute('aria-hidden', 'true'); // assistive tech reads the stable aria-describedby text instead
  if (supportsPopover) tip.popover = 'manual';
  doc.body.append(tip);

  const descriptions = doc.createElement('div');
  descriptions.hidden = true;
  doc.body.append(descriptions);
  let descriptionCount = 0;

  let current = null, source = null, hoverTarget = null, dismissed = null;
  let showTimer = 0, hideTimer = 0, touchTimer = 0, touchStart = null, swallowClick = false;

  const tipTarget = node => {
    const el = node instanceof Element ? node : node?.parentElement;
    if (!el || tip.contains(el)) return null;
    const direct = el.closest('[data-tip]');
    if (direct) return direct;
    const control = el.closest('label')?.control;
    return control?.matches('[data-tip]') ? control : null;
  };

  const lines = el => {
    const out = [el.dataset.tip];
    if (el instanceof HTMLProgressElement) out[0] += ` ${Math.round((el.value / el.max) * 100)}% complete.`;
    if (el.matches(':disabled') && el.dataset.tipDisabled) out.push(`Unavailable: ${el.dataset.tipDisabled}`);
    return out;
  };

  const shortName = el => {
    const aria = el.getAttribute('aria-label');
    if (aria) return aria;
    const label = el.labels?.[0];
    const text = label ? [...label.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.data).join(' ') : el.textContent;
    return text.replace(/\s+/g, ' ').trim().slice(0, 60);
  };

  // Stable accessible descriptions: one hidden node per anchor, referenced by aria-describedby.
  const describe = el => {
    let id = el.dataset.tipDescription;
    if (!id) {
      id = `vg-tip-${++descriptionCount}`;
      el.dataset.tipDescription = id;
      const node = doc.createElement('span');
      node.id = id;
      descriptions.append(node);
      const ids = (el.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
      el.setAttribute('aria-describedby', [...ids, id].join(' '));
    }
    doc.getElementById(id).textContent = lines(el).join(' ');
  };
  const describeAll = root => root.querySelectorAll('[data-tip]').forEach(describe);

  const lanes = () => doc.querySelectorAll('[data-hint-lane]');
  const resetLanes = () => lanes().forEach(lane => {
    lane.dataset.active = 'false';
    lane.querySelector('.hint-text').textContent = IDLE_HINT;
  });

  const context = el => {
    const dialog = el.closest('dialog[open]');
    if (dialog) return { root: dialog, bounds: toRect(dialog.getBoundingClientRect()), lane: dialog.querySelector('[data-hint-lane]'), modal: true };
    const lane = doc.getElementById('hint-lane');
    const bottom = lane ? lane.getBoundingClientRect().top : doc.documentElement.clientHeight;
    return { root: doc.body, bounds: rect(0, 0, doc.documentElement.clientWidth, bottom), lane, modal: false };
  };

  const obstaclesFor = (root, anchorEl, anchor, size) => {
    const region = inflate(anchor, Math.max(size.width, size.height) + 24);
    const out = [];
    const add = r => { if (r.width > 0 && r.height > 0) { const box = toRect(r); if (intersects(box, region)) out.push(box); } };
    for (const el of root.querySelectorAll(OBSTACLES)) {
      if (anchorEl.contains(el) || tip.contains(el) || el.closest('[data-hint-lane]')) continue;
      add(el.getBoundingClientRect());
    }
    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => (n.data.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT) });
    const range = doc.createRange();
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const parent = n.parentElement;
      if (!parent || anchorEl.contains(parent) || tip.contains(parent) || parent.closest('[data-hint-lane]')) continue;
      if (!intersects(toRect(parent.getBoundingClientRect()), region)) continue;
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) add(r);
    }
    const active = doc.activeElement;
    if (active && active !== doc.body && active !== anchorEl && root.contains(active)) out.push(inflate(toRect(active.getBoundingClientRect()), 6));
    return out;
  };

  function hide() {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    if (supportsPopover && tip.matches(':popover-open')) tip.hidePopover();
    tip.dataset.visible = 'false';
    current?.removeAttribute('data-tip-lane');
    current = null;
    source = null;
    resetLanes();
  }

  function show(el, from) {
    if (!el?.isConnected || !el.getClientRects().length) { if (el === current) hide(); return; }
    if (current && current !== el) hide();
    current = el;
    source = from;
    describe(el);
    const text = lines(el);
    const { root, bounds, lane, modal } = context(el);

    tip.replaceChildren(...text.map(t => Object.assign(doc.createElement('span'), { textContent: t })));
    tip.style.maxWidth = `${Math.min(320, bounds.right - bounds.left - 8)}px`;
    tip.style.width = '';
    tip.style.left = '0px';
    tip.style.top = '0px';
    tip.dataset.visible = 'measuring';
    if (supportsPopover) { if (tip.matches(':popover-open')) tip.hidePopover(); tip.showPopover(); } // re-show keeps it above modals

    const anchor = toRect(el.getBoundingClientRect());
    // Lock the measured box: shrink-to-fit near a window edge would otherwise rewrap it taller than measured.
    tip.style.width = `${Math.ceil(tip.getBoundingClientRect().width)}px`;
    const size = { width: tip.offsetWidth, height: tip.offsetHeight };
    const canFloat = supportsPopover || !modal;
    const spot = canFloat ? placeTooltip({ anchor, size, bounds, obstacles: obstaclesFor(root, el, anchor, size) }) : null;

    resetLanes();
    if (spot) {
      tip.style.left = `${spot.left}px`;
      tip.style.top = `${spot.top}px`;
      tip.dataset.placement = spot.placement;
      tip.dataset.visible = 'true';
      el.removeAttribute('data-tip-lane');
    } else {
      if (supportsPopover) tip.hidePopover();
      tip.dataset.visible = 'false';
      if (lane) {
        lane.dataset.active = 'true';
        lane.querySelector('.hint-text').textContent = `${shortName(el)}: ${text.join(' ')}`;
        el.setAttribute('data-tip-lane', 'true');
      }
    }
  }

  // ---- Pointer (mouse and pen): hover after the delay; the tooltip itself is hoverable. ----
  doc.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const hit = doc.elementFromPoint(event.clientX, event.clientY); // hit-testing also reaches disabled controls
    if (hit && tip.contains(hit)) { clearTimeout(hideTimer); return; }
    const target = tipTarget(hit);
    if (target === hoverTarget) return;
    hoverTarget = target;
    if (target !== dismissed) dismissed = null;
    clearTimeout(showTimer);
    if (current && source === 'hover' && current !== target) {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => { hide(); restoreFocusTip(); }, tooltipTiming.hideGrace);
    }
    if (target && target !== dismissed && target !== current) {
      showTimer = setTimeout(() => show(target, 'hover'), current ? 0 : tooltipTiming.showDelay);
    }
  }, { passive: true });
  doc.documentElement.addEventListener('pointerleave', () => {
    hoverTarget = null;
    clearTimeout(showTimer);
    if (source === 'hover') { hide(); restoreFocusTip(); }
  });

  // ---- Keyboard focus: show immediately, hide on blur. ----
  const restoreFocusTip = () => {
    const active = doc.activeElement;
    const target = active && tipTarget(active);
    if (target && active.matches(':focus-visible')) show(target, 'focus');
  };
  doc.addEventListener('focusin', event => {
    const target = tipTarget(event.target);
    if (target && event.target.matches(':focus-visible')) { clearTimeout(showTimer); show(target, 'focus'); }
    else if (source === 'focus') hide();
  });
  doc.addEventListener('focusout', () => { if (source === 'focus') hide(); });

  // ---- Touch: long-press shows; the press then does not activate the control. ----
  doc.addEventListener('pointerdown', event => {
    if (current && source === 'touch' && !tip.contains(event.target)) hide();
    if (event.pointerType !== 'touch') return;
    const target = tipTarget(doc.elementFromPoint(event.clientX, event.clientY));
    if (!target) return;
    touchStart = { x: event.clientX, y: event.clientY };
    clearTimeout(touchTimer);
    touchTimer = setTimeout(() => { show(target, 'touch'); swallowClick = true; }, tooltipTiming.touchHoldDelay);
  });
  doc.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' && touchStart && Math.hypot(event.clientX - touchStart.x, event.clientY - touchStart.y) > 10) clearTimeout(touchTimer);
  }, { passive: true });
  for (const type of ['pointerup', 'pointercancel']) doc.addEventListener(type, () => { clearTimeout(touchTimer); touchStart = null; });
  doc.addEventListener('click', event => { if (swallowClick) { swallowClick = false; event.preventDefault(); event.stopImmediatePropagation(); } }, true);
  doc.addEventListener('contextmenu', event => { if (source === 'touch') event.preventDefault(); });

  // ---- Escape hides a hover/touch tooltip without other effects. Focus tooltips never obscure content,
  //      so Escape keeps its dialog/drawer meaning there (they hide on blur). ----
  doc.defaultView.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !current) return;
    if (source === 'focus') { hide(); return; }
    event.preventDefault();
    event.stopImmediatePropagation();
    dismissed = current;
    hide();
  }, true);

  // ---- Keep text and position current. ----
  new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'childList') record.addedNodes.forEach(n => { if (n instanceof Element) { if (n.matches('[data-tip]')) describe(n); describeAll(n); } });
      else if (record.target instanceof Element && record.target.matches('[data-tip]')) describe(record.target);
    }
    if (current && records.some(r => r.target === current || r.target.contains?.(current))) requestAnimationFrame(() => current && show(current, source));
  }).observe(doc.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['disabled', 'data-tip', 'data-tip-disabled', 'value', 'hidden'] });
  const reposition = () => { if (current) requestAnimationFrame(() => current && show(current, source)); };
  doc.defaultView.addEventListener('resize', reposition);
  doc.addEventListener('scroll', reposition, true);
  for (const dialog of doc.querySelectorAll('dialog')) dialog.addEventListener('close', hide);

  // The window lane is fixed to the bottom; reserve its height so it never covers content.
  const windowLane = doc.getElementById('hint-lane');
  if (windowLane) new ResizeObserver(() => doc.body.style.setProperty('--hint-lane-height', `${windowLane.offsetHeight}px`)).observe(windowLane);

  describeAll(doc);
  resetLanes();
  return { show, hide };
}
