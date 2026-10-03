export function formatLessonCount(count: number): string {
  return count === 1 ? "1 Einheit" : `${count} Einheiten`;
}
