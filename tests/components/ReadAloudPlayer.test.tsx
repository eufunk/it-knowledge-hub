import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReadAloudPlayer } from "@/components/learning/ReadAloudPlayer";

// Simulierte Sprachausgabe mit Warteschlange wie im Browser:
// speak() reiht ein, die erste Äußerung startet sofort, finishCurrent() beendet sie und startet die nächste.
class FakeUtterance {
  text: string;
  lang = "";
  rate = 1;
  voice: unknown = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

let queue: FakeUtterance[] = [];
const spoken: string[] = [];

function startNext() {
  const next = queue[0];
  if (!next) return;
  spoken.push(next.text);
  next.onstart?.();
}

const synth = {
  speak: vi.fn((utterance: FakeUtterance) => {
    queue.push(utterance);
    if (queue.length === 1) startNext();
  }),
  cancel: vi.fn(() => {
    queue = [];
  }),
  getVoices: () => [{ name: "Deutsch", lang: "de-DE" }],
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

function finishCurrent() {
  act(() => {
    const current = queue.shift();
    current?.onend?.();
    startNext();
  });
}

function renderPlayer() {
  const article = document.createElement("article");
  article.id = "kapitel-text";
  article.innerHTML = `
    <h2>Überschrift</h2>
    <p>Ein Absatz, z. B. mit Abkürzung.</p>
    <pre><code>echo nicht vorlesen</code></pre>
    <table><thead><tr><th>Begriff</th><th>Erklärung</th></tr></thead><tbody><tr><td>Trigger</td><td>Startet den Ablauf</td></tr></tbody></table>`;
  document.body.appendChild(article);
  render(<ReadAloudPlayer targetIds={["kapitel-text"]} />);
  return article;
}

describe("F20: ReadAloudPlayer", () => {
  beforeEach(() => {
    queue = [];
    spoken.length = 0;
    synth.cancel.mockClear();
    vi.stubGlobal("speechSynthesis", synth);
    vi.stubGlobal("SpeechSynthesisUtterance", FakeUtterance);
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
    window.localStorage.clear();
  });

  it("liest Abschnitt für Abschnitt vor, Tabellen zeilenweise, ohne Code", () => {
    const article = renderPlayer();
    fireEvent.click(screen.getByRole("button", { name: "Vorlesen starten" }));
    expect(spoken).toEqual(["Überschrift"]);
    expect(article.querySelector("h2")).toHaveClass("speaking");

    finishCurrent();
    finishCurrent();
    finishCurrent();
    expect(spoken).toEqual([
      "Überschrift",
      "Ein Absatz, zum Beispiel mit Abkürzung.",
      "Tabelle mit einer Zeile.",
      "Trigger. Erklärung: Startet den Ablauf.",
    ]);
    expect(article.querySelector("tbody tr")).toHaveClass("speaking");
    expect(screen.getByText("Abschnitt 4 von 4")).toBeInTheDocument();

    finishCurrent();
    expect(screen.getByText("Kapitel vorlesen")).toBeInTheDocument();
    expect(article.querySelector(".speaking")).toBeNull();
  });

  it("liest zuerst Titel und Kurzbeschreibung aus dem Kopf, dann den Kapiteltext", () => {
    const header = document.createElement("header");
    header.id = "kapitel-kopf";
    header.innerHTML = `
      <p data-vorlesen="nein">Modul 1 · Kapitel 01 · 50 Minuten</p>
      <h1>Kapiteltitel</h1>
      <p>Kurzbeschreibung des Kapitels.</p>`;
    const article = document.createElement("article");
    article.id = "kapitel-text";
    article.innerHTML = "<p>Erster Absatz.</p>";
    document.body.append(header, article);
    render(<ReadAloudPlayer targetIds={["kapitel-kopf", "kapitel-text"]} />);

    fireEvent.click(screen.getByRole("button", { name: "Vorlesen starten" }));
    finishCurrent();
    finishCurrent();
    expect(spoken).toEqual(["Kapiteltitel", "Kurzbeschreibung des Kapitels.", "Erster Absatz."]);
    expect(screen.getByText("Abschnitt 3 von 3")).toBeInTheDocument();
  });

  it("legt den nächsten Abschnitt schon in die Warteschlange, ohne abzubrechen", () => {
    renderPlayer();
    fireEvent.click(screen.getByRole("button", { name: "Vorlesen starten" }));
    // Der nächste Abschnitt wartet bereits, damit keine Pause entsteht.
    expect(queue.map((utterance) => utterance.text)).toEqual(["Überschrift", "Ein Absatz, zum Beispiel mit Abkürzung."]);
    const cancelsAtStart = synth.cancel.mock.calls.length;
    finishCurrent();
    finishCurrent();
    expect(synth.cancel.mock.calls.length).toBe(cancelsAtStart);
  });

  it("pausiert und setzt am selben Abschnitt fort", () => {
    renderPlayer();
    fireEvent.click(screen.getByRole("button", { name: "Vorlesen starten" }));
    finishCurrent();
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(queue).toEqual([]);

    fireEvent.click(screen.getByRole("button", { name: "Vorlesen starten" }));
    expect(spoken[spoken.length - 1]).toBe("Ein Absatz, zum Beispiel mit Abkürzung.");
  });

  it("übernimmt die gewählte Geschwindigkeit", () => {
    renderPlayer();
    fireEvent.click(screen.getByRole("button", { name: "Einstellungen zum Vorlesen" }));
    fireEvent.click(screen.getByRole("button", { name: "1,5×" }));
    fireEvent.click(screen.getByRole("button", { name: "Vorlesen starten" }));
    expect(queue[0].rate).toBe(1.5);
  });

  it("zeigt einen Hinweis, wenn der Browser nicht vorlesen kann", () => {
    vi.unstubAllGlobals();
    vi.stubGlobal("speechSynthesis", undefined);
    renderPlayer();
    expect(screen.queryByRole("button", { name: "Vorlesen starten" })).toBeNull();
  });
});
