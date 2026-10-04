// Ziel nach dem Anmelden: nur interne Pfade zulassen (keine offene Weiterleitung auf fremde Seiten)
const FALLBACK = "/lerninhalte";

export function safeNextPath(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return FALLBACK;
  }
  if (value.startsWith("/anmelden") || value.startsWith("/registrieren")) return FALLBACK;
  return value;
}
