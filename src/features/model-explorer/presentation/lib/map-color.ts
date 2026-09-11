export function probColorInterp(p: number): string {
  const clamped = Math.max(0, Math.min(1, p));
  const r = Math.round(255 * (1 - clamped));
  const g = Math.round(207 + (255 - 207) * clamped);
  const b = Math.round(80 * (1 - clamped));
  return `rgb(${r}, ${g}, ${b})`;
}

export function probColorCss(p: number | null): string {
  if (p === null) return 'rgb(190, 190, 190)';
  return probColorInterp(p);
}