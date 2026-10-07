// F20: Vorlese-Stelle im Konto (über /api/vorlesestelle). Fehler werden still ignoriert:
// Dann gilt die Stelle im Browser – Vorlesen darf nie am Server scheitern.
import { parsePosition, type SpeechPosition } from "./speech-position";

const URL_PATH = "/api/vorlesestelle";

function split(chapterKey: string): { kurs: string; kapitel: string } {
  const [kurs, kapitel] = chapterKey.split("/");
  return { kurs, kapitel };
}

export async function fetchRemotePosition(chapterKey: string): Promise<SpeechPosition | null> {
  try {
    const { kurs, kapitel } = split(chapterKey);
    const response = await fetch(`${URL_PATH}?kurs=${encodeURIComponent(kurs)}&kapitel=${encodeURIComponent(kapitel)}`, {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { stelle: unknown };
    return data.stelle ? parsePosition(JSON.stringify(data.stelle)) : null;
  } catch {
    return null;
  }
}

// keepalive: Die Anfrage läuft auch weiter, wenn die Seite gerade verlassen wird.
function post(body: object): void {
  try {
    void fetch(URL_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      keepalive: true,
      body: JSON.stringify(body),
    }).catch(() => {});
  } catch {
    // z. B. fetch nicht verfügbar: Stelle bleibt nur im Browser
  }
}

// Stelle im Konto höchstens so oft speichern (zusätzlich sofort bei Pause, Beenden, Verlassen)
export const REMOTE_SAVE_INTERVAL_MS = 10_000;

// noch nicht gesendete Stelle je Kapitel und Zeitpunkt der letzten Sendung
const pending = new Map<string, SpeechPosition>();
const lastSent = new Map<string, number>();

function send(chapterKey: string, position: SpeechPosition, now: number): void {
  pending.delete(chapterKey);
  lastSent.set(chapterKey, now);
  post({ ...split(chapterKey), index: position.index, total: position.total, text: position.text });
}

// Merkt die Stelle vor und sendet sie, wenn seit der letzten Sendung genug Zeit vergangen ist.
export function queueRemotePosition(chapterKey: string, position: SpeechPosition, now: number = Date.now()): void {
  if (now - (lastSent.get(chapterKey) ?? -Infinity) >= REMOTE_SAVE_INTERVAL_MS) send(chapterKey, position, now);
  else pending.set(chapterKey, position);
}

// Sendet eine vorgemerkte Stelle sofort (Pause, Beenden, Verlassen der Seite).
export function flushRemotePosition(chapterKey: string, now: number = Date.now()): void {
  const position = pending.get(chapterKey);
  if (position) send(chapterKey, position, now);
}

export function clearRemotePosition(chapterKey: string): void {
  pending.delete(chapterKey);
  post({ ...split(chapterKey), loeschen: true });
}
