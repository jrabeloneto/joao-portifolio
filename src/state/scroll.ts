// Global scroll progress store — single source of truth for canvas + overlays.
// progress is 0..1 across the whole virtual scroll. chapters is 6.
export const CHAPTERS = 6;

export const scrollState = {
  progress: 0, // 0..1
  velocity: 0,
  mouseX: 0,   // -1..1
  mouseY: 0,
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
export function envelope(p: number, a: number, b: number, fade = 0.15) {
  if (p < a - fade || p > b + fade) return 0;
  if (p < a) return (p - (a - fade)) / fade;
  if (p > b) return 1 - (p - b) / fade;
  return 1;
}

// Chapter ranges (progress is total 0..1)
export const CH = {
  hero:       [0.00, 0.10] as const,
  about:      [0.12, 0.25] as const,
  projects:   [0.28, 0.70] as const,
  skills:     [0.72, 0.82] as const,
  experience: [0.84, 0.92] as const,
  contact:    [0.94, 1.00] as const,
};
