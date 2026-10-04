// F22/F23: Anmeldestatus und Fortschritt aus dem Konto im Browser.
// Die Inhaltsseiten bleiben statisch; Konto-Daten werden nachträglich über /api/sitzung geladen.

export type AccountStatus = "loading" | "anonymous" | "user";

export interface AccountState {
  status: AccountStatus;
  username: string | null;
  // pro Kurs als JSON-Text, damit useSyncExternalStore stabile Werte vergleicht
  progress: Record<string, string>;
}

export const LOADING_STATE: AccountState = { status: "loading", username: null, progress: {} };

let state: AccountState = LOADING_STATE;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function setState(next: AccountState): void {
  state = next;
  for (const listener of listeners) listener();
}

export function getAccountState(): AccountState {
  return state;
}

export function subscribeAccount(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export async function loadAccount(): Promise<void> {
  try {
    const response = await fetch("/api/sitzung", { cache: "no-store", credentials: "same-origin" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = (await response.json()) as { user: { username: string } | null; progress: Record<string, string[]> };
    if (!data.user) {
      setState({ status: "anonymous", username: null, progress: {} });
      return;
    }
    const progress = Object.fromEntries(Object.entries(data.progress).map(([course, steps]) => [course, JSON.stringify(steps)]));
    setState({ status: "user", username: data.user.username, progress });
  } catch {
    // Server nicht erreichbar: wie ohne Anmeldung weiterarbeiten (Fortschritt im Browser)
    setState({ status: "anonymous", username: null, progress: {} });
  }
}

// Einmal pro Seitenaufruf laden
export function ensureAccountLoaded(): Promise<void> {
  loading ??= loadAccount();
  return loading;
}

export function remoteProgressRaw(courseSlug: string): string {
  return state.progress[courseSlug] ?? "[]";
}

// Sofort anzeigen, dann speichern; bei Fehler zurücknehmen
export async function saveRemoteStep(courseSlug: string, stepId: string, completed: boolean): Promise<void> {
  const before = state;
  const current = new Set(JSON.parse(remoteProgressRaw(courseSlug)) as string[]);
  if (completed) current.add(stepId);
  else current.delete(stepId);
  setState({ ...state, progress: { ...state.progress, [courseSlug]: JSON.stringify([...current]) } });

  try {
    const response = await fetch("/api/fortschritt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ kurs: courseSlug, schritt: stepId, erledigt: completed }),
    });
    if (response.status === 401) {
      // Sitzung abgelaufen: neu laden, Änderung im Browser behalten wir nicht stillschweigend
      setState(before);
      await loadAccount();
      return;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    setState(before);
    console.error("Fortschritt konnte nicht gespeichert werden.", error);
  }
}

// Nur für Tests
export function resetAccountStore(next: AccountState = LOADING_STATE): void {
  loading = null;
  setState(next);
}
