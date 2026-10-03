// F13: Fortschritt = erledigte Einheiten / alle Einheiten, gerundet auf ganze Prozent
export function calcProgress(done: number, total: number): number {
  if (total <= 0) return 0;
  const clamped = Math.min(Math.max(done, 0), total);
  return Math.round((clamped / total) * 100);
}
