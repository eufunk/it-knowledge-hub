// F17: Formatierung in Quiztexten. Die Fragen stammen aus einem HTML-Quiz und enthalten <code>, <br> und
// HTML-Entities. Statt HTML einzufügen, werden sie in sichere Bausteine zerlegt; andere Tags werden entfernt.

export type QuizTextPart = { type: "text"; value: string } | { type: "code"; value: string } | { type: "br" };

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

export function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith("#x") || entity.startsWith("#X")) return String.fromCodePoint(parseInt(entity.slice(2), 16));
    if (entity.startsWith("#")) return String.fromCodePoint(Number(entity.slice(1)));
    return ENTITIES[entity.toLowerCase()] ?? match;
  });
}

export function parseQuizText(text: string): QuizTextPart[] {
  const parts: QuizTextPart[] = [];
  const pattern = /<code>([\s\S]*?)<\/code>|<br\s*\/?>/gi;
  let last = 0;
  const pushText = (raw: string) => {
    const value = decodeEntities(raw.replace(/<[^>]+>/g, ""));
    if (value) parts.push({ type: "text", value });
  };
  for (const match of text.matchAll(pattern)) {
    pushText(text.slice(last, match.index));
    if (match[1] !== undefined) parts.push({ type: "code", value: decodeEntities(match[1].replace(/<[^>]+>/g, "")) });
    else parts.push({ type: "br" });
    last = match.index + match[0].length;
  }
  pushText(text.slice(last));
  return parts;
}

// Reiner Text, z. B. für Schlüssel oder Vergleiche
export function quizPlainText(text: string): string {
  return parseQuizText(text)
    .map((part) => (part.type === "br" ? " " : part.value))
    .join("");
}
