// F20: Text eines Kapitels in vorlesbare Abschnitte zerlegen

export interface SpeechSegment {
  // Element, das beim Vorlesen hervorgehoben wird (bei Tabellen die Zeile)
  element: Element;
  // in Sätze zerlegt, weil manche Browser lange Äußerungen abbrechen
  chunks: string[];
}

const MAX_CHUNK = 220;

function clean(text: string): string {
  return text
    .replace(/→/g, " zu ")
    .replace(/\s+/g, " ")
    .trim();
}

// Lange Texte an Satzgrenzen teilen; einzelne überlange Sätze an Kommas bzw. Leerzeichen.
export function chunkText(text: string, max: number = MAX_CHUNK): string[] {
  const sentences = clean(text).match(/[^.!?:;]+[.!?:;]*\s*/g) ?? [];
  const chunks: string[] = [];
  let current = "";
  const push = (part: string) => {
    if (part.trim()) chunks.push(part.trim());
  };
  for (const sentence of sentences) {
    if ((current + sentence).length <= max) {
      current += sentence;
      continue;
    }
    push(current);
    current = "";
    if (sentence.length <= max) {
      current = sentence;
      continue;
    }
    let rest = sentence;
    while (rest.length > max) {
      const cut = Math.max(rest.lastIndexOf(", ", max), rest.lastIndexOf(" ", max));
      const at = cut > max / 2 ? cut + 1 : max;
      push(rest.slice(0, at));
      rest = rest.slice(at);
    }
    current = rest;
  }
  push(current);
  return chunks;
}

function textOf(element: Element): string {
  return clean(element.textContent ?? "");
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
    chunks: [body.length === 1 ? "Tabelle mit einer Zeile." : `Tabelle mit ${body.length} Zeilen.`],
  };

  const rowSegments = body.map((row): SpeechSegment => {
    const cells = Array.from(row.children).map(textOf);
    const parts = cells.map((cell, index) => {
      if (!cell) return "";
      if (index === 0 || !headers[index]) return withPeriod(cell);
      return withPeriod(`${headers[index]}: ${cell}`);
    });
    return { element: row, chunks: chunkText(parts.filter(Boolean).join(" ")) };
  });

  return [intro, ...rowSegments].filter((segment) => segment.chunks.length > 0);
}

function segment(element: Element): SpeechSegment[] {
  const chunks = chunkText(textOf(element));
  return chunks.length > 0 ? [{ element, chunks }] : [];
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
