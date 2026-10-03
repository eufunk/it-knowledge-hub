import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReadAloudPlayer } from "@/components/learning/ReadAloudPlayer";

// Simulierte Sprachausgabe: merkt sich gesprochene Äußerungen und beendet sie auf Zuruf.
class FakeUtterance {
  text: string;
  lang = "";
  rate = 1;
  voice: unknown = null;
  onend: (() => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

const spoken: FakeUtterance[] = [];
const synth = {
  speak: vi.fn((utterance: FakeUtterance) => spoken.push(utterance)),
  cancel: vi.fn(),
  getVoices: () => [{ name: "Deutsch", lang: "de-DE" }],
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

function finishCurrent() {
  act(() => spoken[spoken.length - 1].onend?.());
}

function renderPlayer() {
  const article = document.createElement("article");
  article.id = "kapitel-text";
  article.innerHTML = `
    <h2>Überschrift</h2>
    <pre><code>echo nicht vorlesen</code></pre>
    <table><thead><tr><th>Begriff</th><th>Erklärung</th></tr></thead><tbody><tr><td>Trigger</td><td>Startet den Ablauf</td></tr></tbody></table>`;
  document.body.appendChild(article);
  render(<ReadAloudPlayer targetId="kapitel-text" />);
  return article;
}

describe("F20: ReadAloudPlayer", () => {
  beforeEach(() => {
    spoken.length = 0;
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
    expect(spoken.map((u) => u.text)).toEqual(["Überschrift"]);
    expect(spoken[0].lang).toBe("de-DE");
    expect(article.querySelector("h2")).toHaveClass("speaking");

    finishCurrent();
    finishCurrent();
    expect(spoken.map((u) => u.text)).toEqual([
      "Überschrift",
      "Tabelle mit einer Zeile.",
      "Trigger. Erklärung: Startet den Ablauf.",
    ]);
    expect(article.querySelector("tbody tr")).toHaveClass("speaking");
    expect(screen.getByText("Abschnitt 3 von 3")).toBeInTheDocument();

    finishCurrent();
    expect(screen.getByText("Kapitel vorlesen")).toBeInTheDocument();
    expect(article.querySelector(".speaking")).toBeNull();
  });

  it("pausiert und setzt am selben Abschnitt fort", () => {
    renderPlayer();
    fireEvent.click(screen.getByRole("button", { name: "Vorlesen starten" }));
    finishCurrent();
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(synth.cancel).toHaveBeenCalled();

    // Ein verspätetes Ende der abgebrochenen Äußerung darf nicht weiterspringen.
    finishCurrent();
    expect(spoken).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: "Vorlesen starten" }));
    expect(spoken[spoken.length - 1].text).toBe("Tabelle mit einer Zeile.");
  });

  it("übernimmt die gewählte Geschwindigkeit", () => {
    renderPlayer();
    fireEvent.click(screen.getByRole("button", { name: "Einstellungen zum Vorlesen" }));
    fireEvent.click(screen.getByRole("button", { name: "1,5×" }));
    fireEvent.click(screen.getByRole("button", { name: "Vorlesen starten" }));
    expect(spoken[0].rate).toBe(1.5);
  });

  it("zeigt einen Hinweis, wenn der Browser nicht vorlesen kann", () => {
    vi.unstubAllGlobals();
    vi.stubGlobal("speechSynthesis", undefined);
    renderPlayer();
    expect(screen.queryByRole("button", { name: "Vorlesen starten" })).toBeNull();
  });
});
