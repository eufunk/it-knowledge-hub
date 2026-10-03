// F20: Text eines Kapitels in vorlesbare Abschnitte zerlegen

export interface SpeechSegment {
  // Element, das beim Vorlesen hervorgehoben wird (bei Tabellen die Zeile)
  element: Element;
  text: string;
}

// Abkürzungen ausschreiben, damit sie flüssig klingen und keine Satzgrenze vortäuschen
const ABBREVIATIONS: [RegExp, string][] = [
  [/\bz\.\s?B\./g, "zum Beispiel"],
  [/\bd\.\s?h\./g, "das heißt"],
  [/\bu\.\s?a\./g, "unter anderem"],
  [/\bu\.\s?U\./g, "unter Umständen"],
  [/\bbzw\./g, "beziehungsweise"],
  [/\bggf\./g, "gegebenenfalls"],
  [/\busw\./g, "und so weiter"],
  [/\binkl\./g, "inklusive"],
  [/\bca\./g, "circa"],
  [/\bvgl\./g, "vergleiche"],
  [/\bsog\./g, "sogenannte"],
  [/\bNr\./g, "Nummer"],
];

export function speakableText(text: string): string {
  let result = text;
  for (const [pattern, replacement] of ABBREVIATIONS) result = result.replace(pattern, replacement);
  return result
    .replace(/→/g, " zu ")
    .replace(/\s+/g, " ")
    .trim();
}

// Grenze je Stimme: Die Google-Stimmen in Chrome brechen nach etwa 15 Sekunden ab, andere nicht.
export function chunkLimit(voice: { name: string } | null | undefined): number {
  return voice && /google/i.test(voice.name) ? 200 : 2000;
}

// Teilt nur an Satzenden; einzelne überlange Sätze notfalls an Kommas bzw. Leerzeichen.
export function chunkText(text: string, max: number): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const chunks: string[] = [];
  let current = "";
  const push = (part: string) => {
    if (part.trim()) chunks.push(part.trim());
  };
  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length <= max) {
      current = candidate;
      continue;
    }
    push(current);
    current = "";
    let rest = sentence;
    while (rest.length > max) {
      const cut = Math.max(rest.lastIndexOf(", ", max), rest.lastIndexOf(" ", max));
      const at = cut > max / 2 ? cut + 1 : max;
      push(rest.slice(0, at));
      rest = rest.slice(at).trim();
    }
    current = rest;
  }
  push(current);
  return chunks;
}

function textOf(element: Element): string {
  return speakableText(element.textContent ?? "");
}

function withPeriod(text: string): string {
  return /[.!?:]$/.test(text) ? text : `${text}.`;
}

function tableSegments(table: Element): SpeechSegment[] {
  const rows = Array.from(table.querySelectorAll("tr"));
  if (rows.length === 0) return [];
  const headers = Array.from(rows[0].children).map(textOf);
  const body = rows.slice(1);
  const intro: SpeechSegment = {
    element: table,
    text: body.length === 1 ? "Tabelle mit einer Zeile." : `Tabelle mit ${body.length} Zeilen.`,
  };

  const rowSegments = body.map((row): SpeechSegment => {
    const cells = Array.from(row.children).map(textOf);
    const parts = cells.map((cell, index) => {
      if (!cell) return "";
      if (index === 0 || !headers[index]) return withPeriod(cell);
      return withPeriod(`${headers[index]}: ${cell}`);
    });
    return { element: row, text: parts.filter(Boolean).join(" ") };
  });

  return [intro, ...rowSegments].filter((segment) => segment.text !== "");
}

function segment(element: Element): SpeechSegment[] {
  const text = textOf(element);
  return text ? [{ element, text }] : [];
}

// Liest Überschriften, Absätze, Listenpunkte, Hinweisboxen und Tabellen; überspringt Code und eingeklappte Lösungen.
export function extractSegments(root: Element): SpeechSegment[] {
  const result: SpeechSegment[] = [];
  for (const child of Array.from(root.children)) {
    const tag = child.tagName.toLowerCase();
    if (tag === "pre" || tag === "details" || tag === "figure" || tag === "hr") continue;
    if (child.matches("[data-rehype-pretty-code-figure]")) continue;
    if (tag === "table") result.push(...tableSegments(child));
    else if (tag === "ul" || tag === "ol") {
      for (const item of Array.from(child.children)) result.push(...segment(item));
    } else if (tag === "div" || tag === "section") result.push(...extractSegments(child));
    else result.push(...segment(child));
  }
  return result;
}
