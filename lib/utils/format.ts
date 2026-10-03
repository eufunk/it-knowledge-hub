export function plural(count: number, singular: string, pluralForm: string): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

export function formatCourseSize(moduleCount: number, chapterCount: number): string {
  return `${plural(moduleCount, "Modul", "Module")} · ${plural(chapterCount, "Kapitel", "Kapitel")}`;
}
