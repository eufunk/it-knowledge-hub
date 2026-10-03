// F12/F14: Fortschritt im localStorage, ein Schlüssel pro Kurs.
// Jeder Zugriff ist abgesichert – ohne Speicher gilt der Kurs als nicht begonnen.

const CHANGE_EVENT = "progress-change";

export function progressKey(courseSlug: string): string {
  return `progress:v1:${courseSlug}`;
}

export function readProgressRaw(courseSlug: string): string | null {
  try {
    return window.localStorage.getItem(progressKey(courseSlug));
  } catch {
    return null;
  }
}

export function parseCompleted(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function setLessonCompleted(courseSlug: string, lessonSlug: string, completed: boolean): void {
  const current = new Set(parseCompleted(readProgressRaw(courseSlug)));
  if (completed) current.add(lessonSlug);
  else current.delete(lessonSlug);
  try {
    window.localStorage.setItem(progressKey(courseSlug), JSON.stringify([...current]));
  } catch {
    // Speicher blockiert (z. B. privates Fenster): Fortschritt geht beim Neuladen verloren.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// Für useSyncExternalStore: reagiert auf Änderungen in diesem und in anderen Tabs.
export function subscribeProgress(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
