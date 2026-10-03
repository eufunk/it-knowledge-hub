// F20: Vorlese-Einstellungen (Geschwindigkeit, Stimme) im Browser merken – reine Komfortfunktion.

const KEY = "vorlesen:v1";
const CHANGE_EVENT = "vorlesen-change";

export const RATES = [0.75, 1, 1.25, 1.5] as const;

export interface SpeechSettings {
  rate: number;
  voice: string | null;
}

export const DEFAULT_SETTINGS: SpeechSettings = { rate: 1, voice: null };

export function readSettingsRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function parseSettings(raw: string | null): SpeechSettings {
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const value = JSON.parse(raw) as Partial<SpeechSettings>;
    return {
      rate: RATES.includes(value.rate as (typeof RATES)[number]) ? (value.rate as number) : DEFAULT_SETTINGS.rate,
      voice: typeof value.voice === "string" ? value.voice : null,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: SpeechSettings): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // Speicher blockiert: Einstellungen gelten nur bis zum Neuladen nicht – unkritisch.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeSettings(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

// Bevorzugt natürlich klingende deutsche Stimmen (z. B. „Microsoft … Online (Natural)“ in Edge).
export function pickVoice<T extends { name: string; lang: string }>(voices: T[], preferred: string | null): T | null {
  const german = voices.filter((voice) => voice.lang.toLowerCase().startsWith("de"));
  if (german.length === 0) return null;
  return (
    german.find((voice) => voice.name === preferred) ??
    german.find((voice) => /natural|online/i.test(voice.name)) ??
    german.find((voice) => /google/i.test(voice.name)) ??
    german[0]
  );
}
