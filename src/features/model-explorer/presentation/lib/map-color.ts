function interpolate(a: [number, number, number], b: [number, number, number], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bb = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bb})`;
}

export function probColorInterp(p: number): string {
  const clamped = Math.max(0, Math.min(1, p));
  if (clamped < 0.5) {
    return interpolate([220, 38, 38], [250, 204, 21], clamped / 0.5);
  }
  return interpolate([250, 204, 21], [16, 185, 40], (clamped - 0.5) / 0.5);
}

export function probColorCss(p: number | null): string {
  if (p === null) return 'rgb(190, 190, 190)';
  return probColorInterp(p);
}