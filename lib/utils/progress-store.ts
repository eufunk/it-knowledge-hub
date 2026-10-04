// F12/F14/F23: Fortschritt – ohne Anmeldung im localStorage, angemeldet im Konto (Datenbank).
// Jeder Zugriff auf den localStorage ist abgesichert – ohne Speicher gilt der Kurs als nicht begonnen.
import { ensureAccountLoaded, getAccountState, remoteProgressRaw, saveRemoteStep, subscribeAccount } from "./account-store";

const CHANGE_EVENT = "progress-change";
const KEY_PREFIX = "progress:v1:";

export function progressKey(courseSlug: string): string {
  return `${KEY_PREFIX}${courseSlug}`;
}

function readLocalRaw(courseSlug: string): string | null {
  try {
    return window.localStorage.getItem(progressKey(courseSlug));
  } catch {
    return null;
  }
}

export function readProgressRaw(courseSlug: string): string | null {
  if (getAccountState().status === "user") return remoteProgressRaw(courseSlug);
  return readLocalRaw(courseSlug);
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
  const { status } = getAccountState();
  // Anmeldestatus wird noch geladen: erst danach entscheiden, ob Konto oder Browser gilt
  if (status === "loading") {
    void ensureAccountLoaded().then(() => setLessonCompleted(courseSlug, lessonSlug, completed));
    return;
  }
  if (status === "user") {
    void saveRemoteStep(courseSlug, lessonSlug, completed);
    return;
  }
  const current = new Set(parseCompleted(readLocalRaw(courseSlug)));
  if (completed) current.add(lessonSlug);
  else current.delete(lessonSlug);
  try {
    window.localStorage.setItem(progressKey(courseSlug), JSON.stringify([...current]));
  } catch {
    // Speicher blockiert (z. B. privates Fenster): Fortschritt geht beim Neuladen verloren.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// F24: gesamter Browser-Fortschritt aller Kurse, z. B. zur Übernahme ins Konto beim Anmelden
export function collectLocalProgress(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key?.startsWith(KEY_PREFIX)) continue;
      const steps = parseCompleted(window.localStorage.getItem(key));
      if (steps.length > 0) result[key.slice(KEY_PREFIX.length)] = steps;
    }
  } catch {
    // Speicher blockiert: nichts zu übernehmen
  }
  return result;
}

// Für useSyncExternalStore: reagiert auf Änderungen in diesem und in anderen Tabs sowie auf An-/Abmelden.
export function subscribeProgress(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  const unsubscribeAccount = subscribeAccount(onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
    unsubscribeAccount();
  };
}
