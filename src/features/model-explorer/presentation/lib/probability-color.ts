export function probColor(p: number | null): string {
  if (p === null) return 'sin-dato';
  if (p < 0.55) return 'bajo';
  if (p < 0.7) return 'medio';
  return 'alto';
}