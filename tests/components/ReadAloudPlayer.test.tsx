import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
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
  render(<ReadAloudPlayer targetIds={["kapitel-text"]} positionKey="kurs/kapitel" />);
  return article;
}

// Text eines Elements markieren, wie es der Browser beim Ziehen mit der Maus tut
function markiere(element: Element) {
  act(() => {
    window.getSelection()?.selectAllChildren(element);
    document.dispatchEvent(new Event("selectionchange"));
  });
}

// Seite verlassen: Player entfernen, Inhalt leeren, Warteschlange verwerfen (der Speicher bleibt)
function cleanupPage() {
  cleanup();
  document.body.innerHTML = "";
  queue = [];
}

// Konto-Schnittstelle: GET liefert die gespeicherte Stelle (Standard: keine), POST nimmt Speicherungen an
let remoteStelle: object | null = null;
const fetchMock = vi.fn(async (_url: string, init?: RequestInit) =>
  init?.method === "POST" ? new Response(null, { status: 204 }) : Response.json({ stelle: remoteStelle }),
);
const postedBodies = () =>
  fetchMock.mock.calls.filter(([, init]) => init?.method === "POST").map(([, init]) => JSON.parse(String(init?.body)));

describe("F20: ReadAloudPlayer", () => {
  beforeEach(() => {
    remoteStelle = null;
    fetchMock.mockClear();
    vi.stubGlobal("fetch", fetchMock);
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
    render(<ReadAloudPlayer targetIds={["kapitel-kopf", "kapitel-text"]} positionKey="kurs/kopf" />);

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

  it("setzt nach erneutem Öffnen der Seite an der zuletzt vorgelesenen Stelle fort", () => {
    renderPlayer();
    fireEvent.click(screen.getByRole("button", { name: "Vorlesen starten" }));
    finishCurrent();
    fireEvent.click(screen.getByRole("button", { name: "Vorlesen beenden" }));
    expect(screen.getByText("Weiter bei Abschnitt 2 von 4")).toBeInTheDocument();

    // Seite verlassen und später neu öffnen
    cleanupPage();
    spoken.length = 0;
    renderPlayer();
    expect(screen.getByText("Weiter bei Abschnitt 2 von 4")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Vorlesen starten" }));
    expect(spoken[0]).toBe("Ein Absatz, zum Beispiel mit Abkürzung.");
  });

  it("beginnt mit „Von vorn“ am Anfang und vergisst die Stelle nach dem Kapitelende", () => {
    renderPlayer();
    fireEvent.click(screen.getByRole("button", { name: "Vorlesen starten" }));
    finishCurrent();
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    spoken.length = 0;
    fireEvent.click(screen.getByRole("button", { name: "Von vorn vorlesen" }));
    expect(spoken[0]).toBe("Überschrift");

    finishCurrent();
    finishCurrent();
    finishCurrent();
    finishCurrent();
    expect(window.localStorage.getItem("vorlesen-stelle:v1:kurs/kapitel")).toBeNull();
    cleanupPage();
    renderPlayer();
    expect(screen.getByText("Kapitel vorlesen")).toBeInTheDocument();
  });

  it("setzt an der Stelle aus dem Konto fort, wenn sie neuer ist als die im Browser", async () => {
    window.localStorage.setItem(
      "vorlesen-stelle:v1:kurs/kapitel",
      JSON.stringify({ index: 1, total: 4, text: "Ein Absatz, z. B. mit Abkürzung.", updatedAt: 1000 }),
    );
    remoteStelle = { index: 2, total: 4, text: "Tabelle mit einer Zeile.", updatedAt: 5000 };
    renderPlayer();
    await waitFor(() => expect(screen.getByText("Weiter bei Abschnitt 3 von 4")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Vorlesen starten" }));
    expect(spoken[0]).toBe("Tabelle mit einer Zeile.");
  });

  it("speichert die Stelle im Konto und löscht sie mit „Von vorn“", async () => {
    renderPlayer();
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    fireEvent.click(screen.getByRole("button", { name: "Vorlesen starten" }));
    finishCurrent();
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(postedBodies().at(-1)).toMatchObject({ kurs: "kurs", kapitel: "kapitel", index: 1, total: 4 });

    fireEvent.click(screen.getByRole("button", { name: "Von vorn vorlesen" }));
    expect(postedBodies().some((body) => body.loeschen === true)).toBe(true);
  });

  it("liest mit „Ab hier vorlesen“ ab dem Abschnitt der Markierung vor", () => {
    const article = renderPlayer();
    expect(screen.queryByRole("button", { name: "Ab hier vorlesen" })).toBeNull();

    markiere(article.querySelector("tbody td:last-child")!);
    fireEvent.click(screen.getByRole("button", { name: "Ab hier vorlesen" }));
    expect(spoken).toEqual(["Trigger. Erklärung: Startet den Ablauf."]);
    expect(screen.getByText("Abschnitt 4 von 4")).toBeInTheDocument();
    expect(window.getSelection()?.isCollapsed).toBe(true);
    expect(screen.queryByRole("button", { name: "Ab hier vorlesen" })).toBeNull();

    // während des Vorlesens springt der Knopf zum markierten Abschnitt
    markiere(article.querySelector("p")!);
    fireEvent.click(screen.getByRole("button", { name: "Ab hier vorlesen" }));
    expect(spoken[spoken.length - 1]).toBe("Ein Absatz, zum Beispiel mit Abkürzung.");
  });

  it("zeigt „Ab hier vorlesen“ nicht für Markierungen außerhalb des Kapitels", () => {
    renderPlayer();
    const outside = document.createElement("p");
    outside.textContent = "Seitenleiste";
    document.body.appendChild(outside);
    markiere(outside);
    expect(screen.queryByRole("button", { name: "Ab hier vorlesen" })).toBeNull();
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
