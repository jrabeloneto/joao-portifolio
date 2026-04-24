// Global scroll progress store — single source of truth for canvas + overlays.
// progress is 0..1 across the whole virtual scroll.

export const scrollState = {
  progress: 0, // 0..1
  velocity: 0,
  mouseX: 0,   // -1..1
  mouseY: 0,
  hoveredSkill: -1, // index of hovered skill point, -1 if none
  skillHoverX: 0,   // screen coord of hovered skill
  skillHoverY: 0,
};

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

export function notify() {
  listeners.forEach((l) => l());
}

// Range [a,b] -> local 0..1 (clamped)
export function range(p: number, a: number, b: number) {
  return Math.max(0, Math.min(1, (p - a) / (b - a)));
}

// Smooth triangular envelope: 0 outside [a,b], 1 at midpoint, fades in/out
export function envelope(p: number, a: number, b: number, fade = 0.04) {
  if (p < a - fade || p > b + fade) return 0;
  if (p < a) return (p - (a - fade)) / fade;
  if (p > b) return 1 - (p - b) / fade;
  return 1;
}

/**
 * 9-chapter narrative:
 *  0 HERO        — dusk dream field, sun
 *  1 ABOUT       — drifting through clouds (professional copy)
 *  2 APPROACH    — values / philosophy (new)
 *  3 SKILLS      — interactive constellation (hover shows label)
 *  4 PROJECTS    — long spiral of 8 screens through space
 *  5 EXPERIENCE  — timeline trail
 *  6 STORM       — dark clouds, lightning, weirdcore eyes on flash
 *  7 FIELD       — descending to green field with house on hill, blue horizon
 *  8 HOUSE       — inside the house, contact on computer monitor
 */
export const CH = {
  hero:       [0.00, 0.08] as const,
  about:      [0.10, 0.18] as const,
  approach:   [0.20, 0.28] as const,
  skills:     [0.30, 0.42] as const,
  projects:   [0.44, 0.66] as const,
  experience: [0.68, 0.74] as const,
  storm:      [0.76, 0.84] as const,
  field:      [0.86, 0.93] as const,
  house:      [0.95, 1.00] as const,
};

// Camera path key points (z depth). Camera dolly is driven by progress.
// Each value below is the z at progress = index * (1/9).
export const CAMERA_Z = [
  5,      // 0.00 start
  -30,    // hero fade-out
  -60,    // about
  -90,    // approach
  -130,   // skills (deep space)
  -200,   // projects enter
  -340,   // projects mid/exit (long range!)
  -400,   // experience
  -450,   // storm
  -510,   // field descent (approaching house exterior)
  -552,   // inside the house, sitting at the desk in front of monitor
];

export function cameraZAt(p: number) {
  const segs = CAMERA_Z.length - 1;
  const t = p * segs;
  const i = Math.floor(t);
  const f = t - i;
  const a = CAMERA_Z[Math.min(i, segs)];
  const b = CAMERA_Z[Math.min(i + 1, segs)];
  return a + (b - a) * f;
}
