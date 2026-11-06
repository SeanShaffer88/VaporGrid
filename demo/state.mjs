// Display preferences only. Importing this module has no side effects.
export const defaults = Object.freeze({version:1, theme:'system', accent:'crimson', density:'comfortable', effects:false, width:300, collapsed:false, settingsSection:'appearance', settingsPinned:false});
export function constrainWidth(value) {
  return Number.isFinite(value) ? Math.min(420, Math.max(240, Math.round(value))) : defaults.width;
}
export function readPreferences(raw) {
  if (typeof raw !== 'string' || raw.length > 2048) return {...defaults};
  try {
    const p = JSON.parse(raw);
    if (!p || p.version !== 1 || Array.isArray(p)) return {...defaults};
    return {version:1,
      theme:['system','light','dark'].includes(p.theme) ? p.theme : defaults.theme,
      accent:['crimson','blue','teal'].includes(p.accent) ? p.accent : defaults.accent,
      density:['compact','comfortable','touch'].includes(p.density) ? p.density : defaults.density,
      effects:typeof p.effects === 'boolean' ? p.effects : defaults.effects,
      width:Number.isFinite(p.width) && p.width >= 240 && p.width <= 420 ? Math.round(p.width) : defaults.width,
      collapsed:typeof p.collapsed === 'boolean' ? p.collapsed : defaults.collapsed,
      settingsSection:['appearance','layout','shortcuts'].includes(p.settingsSection) ? p.settingsSection : defaults.settingsSection,
      settingsPinned:typeof p.settingsPinned === 'boolean' ? p.settingsPinned : defaults.settingsPinned};
  } catch { return {...defaults}; }
}
export function transition(state, action) {
  if (action === 'start' && ['ready','completed','cancelled'].includes(state.status)) return {status:'running', progress:0};
  if (action === 'pause' && state.status === 'running') return {...state, status:'paused'};
  if (action === 'resume' && state.status === 'paused') return {...state, status:'running'};
  if (action === 'cancel' && ['running','paused'].includes(state.status)) return {...state, status:'cancelled'};
  if (action === 'tick' && state.status === 'running') {
    const progress = Math.min(100, state.progress + 5);
    return {status:progress === 100 ? 'completed' : 'running', progress};
  }
  return state;
}
