// F20: Zuletzt vorgelesene Stelle pro Kapitel im Browser merken – reine Komfortfunktion.

const PREFIX = "vorlesen-stelle:v1:";
// Länge des Textanfangs, über den ein Abschnitt wiedergefunden wird
const TEXT_LENGTH = 80;

export interface SpeechPosition {
  index: number;
  total: number;
  text: string;
}

export function positionStorageKey(chapterKey: string): string {
  return PREFIX + chapterKey;
}

export function readPositionRaw(chapterKey: string): string | null {
  try {
    return window.localStorage.getItem(positionStorageKey(chapterKey));
  } catch {
    return null;
  }
}

export function parsePosition(raw: string | null): SpeechPosition | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<SpeechPosition>;
    const { index, total, text } = value;
    if (!Number.isInteger(index) || !Number.isInteger(total) || (index as number) < 0 || (total as number) < 1) return null;
    return { index: index as number, total: total as number, text: typeof text === "string" ? text : "" };
  } catch {
    return null;
  }
}

export function makePosition(index: number, total: number, text: string): SpeechPosition {
  return { index, total, text: text.slice(0, TEXT_LENGTH) };
}

export function savePosition(chapterKey: string, position: SpeechPosition): void {
  try {
    window.localStorage.setItem(positionStorageKey(chapterKey), JSON.stringify(position));
  } catch {
    // Speicher blockiert: Die Stelle gilt dann nur, solange die Seite offen ist – unkritisch.
  }
}

export function clearPosition(chapterKey: string): void {
  try {
    window.localStorage.removeItem(positionStorageKey(chapterKey));
  } catch {
    // siehe savePosition
  }
}

// Sucht den gespeicherten Abschnitt über seinen Textanfang (das Kapitel kann sich geändert haben),
// zuerst nahe der gespeicherten Nummer; sonst gilt die Nummer, begrenzt auf die vorhandenen Abschnitte.
export function resolvePosition(position: SpeechPosition, texts: string[]): number {
  if (texts.length === 0) return 0;
  if (position.text) {
    const matches = texts
      .map((text, index) => (text.slice(0, TEXT_LENGTH) === position.text ? index : -1))
      .filter((index) => index >= 0);
    if (matches.length > 0) {
      return matches.reduce((best, index) =>
        Math.abs(index - position.index) < Math.abs(best - position.index) ? index : best,
      );
    }
  }
  return Math.min(position.index, texts.length - 1);
}
