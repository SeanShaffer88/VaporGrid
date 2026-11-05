// Pure tooltip placement for the VaporGrid tooltip contract. No DOM access, so it runs under node --test.
// A tooltip may only occupy space that touches no obstacle (text, controls, fields, icons), stays clear of the
// anchor and its focus ring, and fits inside the bounds. When no candidate fits, the caller uses the hint lane.

/** @typedef {{left:number, top:number, right:number, bottom:number}} Rect */

export const defaultPlacement = Object.freeze({
  order: ['below', 'above', 'end', 'start'],
  gap: 8,             // distance between the anchor and the tooltip
  anchorClearance: 6, // the anchor's 3px focus outline plus its 3px offset
  edgeInset: 4,       // keep this far from the bounds
});

export const rect = (left, top, width, height) => ({ left, top, right: left + width, bottom: top + height });
export const inflate = (r, by) => ({ left: r.left - by, top: r.top - by, right: r.right + by, bottom: r.bottom + by });
export const intersects = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
const inside = (r, bounds) => r.left >= bounds.left && r.top >= bounds.top && r.right <= bounds.right && r.bottom <= bounds.bottom;
const clamp = (value, min, max) => Math.min(Math.max(value, min), Math.max(min, max));

/** Candidate rectangles for one side, from preferred alignment to fallbacks. */
function candidates(side, anchor, size, gap, area) {
  const { width, height } = size;
  const cx = (anchor.left + anchor.right) / 2 - width / 2;
  const cy = (anchor.top + anchor.bottom) / 2 - height / 2;
  const xs = [cx, anchor.left, anchor.right - width].map(x => clamp(x, area.left, area.right - width));
  const ys = [cy, anchor.top, anchor.bottom - height].map(y => clamp(y, area.top, area.bottom - height));
  switch (side) {
    case 'below': return xs.map(x => rect(x, anchor.bottom + gap, width, height));
    case 'above': return xs.map(x => rect(x, anchor.top - gap - height, width, height));
    case 'end': return ys.map(y => rect(anchor.right + gap, y, width, height));
    case 'start': return ys.map(y => rect(anchor.left - gap - width, y, width, height));
    default: throw new Error(`Unknown placement: ${side}`);
  }
}

/**
 * @param {{anchor: Rect, size: {width:number, height:number}, bounds: Rect, obstacles: Rect[], options?: Partial<typeof defaultPlacement>}} input
 * @returns {{placement: string, left: number, top: number} | null} null means "use the hint lane".
 */
export function placeTooltip({ anchor, size, bounds, obstacles, options = {} }) {
  const { order, gap, anchorClearance, edgeInset } = { ...defaultPlacement, ...options };
  const area = inflate(bounds, -edgeInset);
  const blocked = [inflate(anchor, anchorClearance), ...obstacles];
  for (const side of order) {
    for (const candidate of candidates(side, anchor, size, gap, area)) {
      if (inside(candidate, area) && !blocked.some(obstacle => intersects(candidate, obstacle))) {
        return { placement: side, left: candidate.left, top: candidate.top };
      }
    }
  }
  return null;
}

export const tooltipTiming = Object.freeze({ showDelay: 500, touchHoldDelay: 500, hideGrace: 100 });
