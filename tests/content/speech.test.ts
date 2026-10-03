import { describe, expect, it } from "vitest";
import { chunkLimit, chunkText, extractSegments, speakableText } from "@/lib/utils/speech";
import { parseSettings, pickVoice } from "@/lib/utils/speech-settings";

function article(html: string): HTMLElement {
  const element = document.createElement("article");
  element.innerHTML = html;
  return element;
}

describe("F20: Abschnitte zum Vorlesen", () => {
  it("liest Überschriften, Absätze, Listenpunkte und Hinweisboxen", () => {
    const segments = extractSegments(
      article(`
        <h2>Funktionsweise</h2>
        <p>Jede Automatisierung folgt dem <strong>EVA-Prinzip</strong>.</p>
        <ol><li>Auslöser</li><li>Eingabe</li></ol>
        <blockquote class="callout"><p><strong>Tipp:</strong> Klein anfangen.</p></blockquote>
      `),
    );
    expect(segments.map((segment) => segment.text)).toEqual([
      "Funktionsweise",
      "Jede Automatisierung folgt dem EVA-Prinzip.",
      "Auslöser",
      "Eingabe",
      "Tipp: Klein anfangen.",
    ]);
    expect(segments[2].element.tagName).toBe("LI");
  });

  it("überspringt Codeblöcke und eingeklappte Musterlösungen", () => {
    const segments = extractSegments(
      article(`
        <p>Vorher</p>
        <figure data-rehype-pretty-code-figure=""><pre><code>echo hallo</code></pre></figure>
        <pre><code>Get-Process</code></pre>
        <details><summary>Musterlösung anzeigen</summary><p>Geheim</p></details>
        <p>Nachher</p>
      `),
    );
    expect(segments.map((segment) => segment.text)).toEqual(["Vorher", "Nachher"]);
  });

  it("liest Tabellen zeilenweise mit Spaltenüberschriften", () => {
    const segments = extractSegments(
      article(`
        <table>
          <thead><tr><th>Grad</th><th>Beschreibung</th><th>Beispiel</th></tr></thead>
          <tbody>
            <tr><td>Manuell</td><td>Ein Mensch führt jeden Schritt aus</td><td>Konto per Klick anlegen</td></tr>
            <tr><td>Vollautomatisiert</td><td>Läuft ohne Eingriff.</td><td></td></tr>
          </tbody>
        </table>
      `),
    );
    expect(segments.map((segment) => segment.text)).toEqual([
      "Tabelle mit 2 Zeilen.",
      "Manuell. Beschreibung: Ein Mensch führt jeden Schritt aus. Beispiel: Konto per Klick anlegen.",
      "Vollautomatisiert. Beschreibung: Läuft ohne Eingriff.",
    ]);
    expect(segments[1].element.tagName).toBe("TR");
  });
});

describe("F20: flüssiges Vorlesen", () => {
  it("schreibt Abkürzungen aus", () => {
    expect(speakableText("Tools wie z. B. Ansible, d. h. Konfiguration bzw. Code, ggf. usw.")).toBe(
      "Tools wie zum Beispiel Ansible, das heißt Konfiguration beziehungsweise Code, gegebenenfalls und so weiter",
    );
    expect(speakableText("Messen → Vergleichen")).toBe("Messen zu Vergleichen");
  });

  it("teilt bei natürlichen Stimmen gar nicht, bei Google-Stimmen an Satzenden", () => {
    const paragraph = "Das ist ein Satz mit einigen Wörtern darin. ".repeat(12).trim();
    expect(chunkText(paragraph, chunkLimit({ name: "Microsoft Katja Online (Natural)" }))).toEqual([paragraph]);

    const chunks = chunkText(paragraph, chunkLimit({ name: "Google Deutsch" }));
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((chunk) => chunk.length <= 200 && chunk.endsWith("."))).toBe(true);
    expect(chunks.join(" ")).toBe(paragraph);
  });

  it("teilt nicht an Doppelpunkten oder Zahlen mit Punkt", () => {
    expect(chunkText("Schritt 1.2: Messen, dann vergleichen.", 30)).toEqual(["Schritt 1.2: Messen, dann", "vergleichen."]);
    expect(chunkText("Schritt 1.2: Messen.", 200)).toEqual(["Schritt 1.2: Messen."]);
  });

  it("teilt überlange Sätze ohne Satzzeichen, ohne Wörter zu verlieren", () => {
    const chunks = chunkText("wort ".repeat(100).trim(), 50);
    expect(chunks.every((chunk) => chunk.length <= 50)).toBe(true);
    expect(chunks.join(" ").split(" ")).toHaveLength(100);
  });
});

describe("F20: Einstellungen und Stimmenwahl", () => {
  const voices = [
    { name: "English", lang: "en-US" },
    { name: "Microsoft Hedda", lang: "de-DE" },
    { name: "Microsoft Katja Online (Natural)", lang: "de-DE" },
  ];

  it("bevorzugt die gespeicherte, sonst eine natürliche deutsche Stimme", () => {
    expect(pickVoice(voices, "Microsoft Hedda")?.name).toBe("Microsoft Hedda");
    expect(pickVoice(voices, null)?.name).toBe("Microsoft Katja Online (Natural)");
    expect(pickVoice([{ name: "English", lang: "en-US" }], null)).toBeNull();
  });

  it("fällt bei ungültigen Einstellungen auf Standardwerte zurück", () => {
    expect(parseSettings(null)).toEqual({ rate: 1, voice: null });
    expect(parseSettings("kaputt")).toEqual({ rate: 1, voice: null });
    expect(parseSettings('{"rate": 7, "voice": 3}')).toEqual({ rate: 1, voice: null });
    expect(parseSettings('{"rate": 1.25, "voice": "Katja"}')).toEqual({ rate: 1.25, voice: "Katja" });
  });
});
