"use client";

import { Pause, Play, RotateCcw, Settings2, SkipBack, SkipForward, Square, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { chunkLimit, chunkText, extractSegments, segmentIndexAt, type SpeechSegment } from "@/lib/utils/speech";
import {
  clearPosition,
  makePosition,
  newerPosition,
  parsePosition,
  readPositionRaw,
  resolvePosition,
  savePosition,
  type SpeechPosition,
} from "@/lib/utils/speech-position";
import {
  clearRemotePosition,
  fetchRemotePosition,
  flushRemotePosition,
  queueRemotePosition,
} from "@/lib/utils/speech-position-remote";
import {
  isNaturalVoice,
  parseSettings,
  pickVoice,
  RATES,
  readSettingsRaw,
  saveSettings,
  subscribeSettings,
  type SpeechSettings,
} from "@/lib/utils/speech-settings";

type Status = "idle" | "playing" | "paused";

const NO_VOICES: SpeechSynthesisVoice[] = [];
let voiceCache: SpeechSynthesisVoice[] | null = null;

function isSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

// Stimmen laden manche Browser verzögert („voiceschanged“); der Zwischenspeicher hält die Referenz stabil.
function subscribeVoices(onChange: () => void): () => void {
  if (!isSupported()) return () => {};
  const synth = window.speechSynthesis;
  const handler = () => {
    voiceCache = synth.getVoices();
    onChange();
  };
  synth.addEventListener("voiceschanged", handler);
  return () => synth.removeEventListener("voiceschanged", handler);
}

function getVoices(): SpeechSynthesisVoice[] {
  if (!isSupported()) return NO_VOICES;
  if (voiceCache === null) voiceCache = window.speechSynthesis.getVoices();
  return voiceCache;
}

const noopSubscribe = () => () => {};

// Knopf „Ab hier vorlesen“: So lange bleibt er nach dem Aufheben der Markierung noch klickbar,
// weil ein Tippen auf dem Handy die Markierung schon vor dem Klick aufhebt.
const FROM_HERE_HIDE_DELAY_MS = 400;
const FROM_HERE_WIDTH = 180;

// Position des Knopfs unter dem Ende der Markierung (über ihr, wenn unten der Player im Weg wäre)
function fromHerePosition(range: Range): { top: number; left: number } {
  const rects = typeof range.getClientRects === "function" ? Array.from(range.getClientRects()) : [];
  const first = rects[0];
  const last = rects[rects.length - 1];
  if (!first || !last) return { top: 16, left: 16 };
  const below = last.bottom + 8;
  const top = below > window.innerHeight - 140 ? Math.max(first.top - 48, 8) : below;
  const left = Math.min(Math.max(last.left, 8), Math.max(window.innerWidth - FROM_HERE_WIDTH - 8, 8));
  return { top, left };
}

const iconButton =
  "flex size-10 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-40 disabled:hover:bg-transparent";

// F20: Vorlese-Player für ein Kapitel (Web Speech API)
// targetIds: Bereiche in Lesereihenfolge, z. B. Kopf (Titel, Kurzbeschreibung) und Kapiteltext
// positionKey: Kennung des Kapitels („<kurs>/<kapitel>“), unter der die zuletzt vorgelesene Stelle gespeichert wird
export function ReadAloudPlayer({ targetIds, positionKey }: { targetIds: string[]; positionKey: string }) {
  // null = noch unbekannt (Server und erstes Rendern), dann true/false im Browser
  const supported = useSyncExternalStore<boolean | null>(noopSubscribe, isSupported, () => null);
  const voices = useSyncExternalStore(subscribeVoices, getVoices, () => NO_VOICES);
  const settingsRaw = useSyncExternalStore(subscribeSettings, readSettingsRaw, () => null);
  const settings = useMemo(() => parseSettings(settingsRaw), [settingsRaw]);
  // gespeicherte Stelle aus einem früheren Besuch (nur für Anzeige und ersten Start):
  // im Browser und im Konto – die zuletzt gespeicherte gilt
  const savedRaw = useSyncExternalStore(noopSubscribe, () => readPositionRaw(positionKey), () => null);
  const [remote, setRemote] = useState<SpeechPosition | null>(null);
  const saved = useMemo(() => newerPosition(parsePosition(savedRaw), remote), [savedRaw, remote]);
  const voice = useMemo(() => pickVoice(voices, settings.voice), [voices, settings.voice]);
  const germanVoices = useMemo(
    () =>
      voices
        .filter((item) => item.lang.toLowerCase().startsWith("de"))
        .sort((a, b) => Number(isNaturalVoice(b)) - Number(isNaturalVoice(a))),
    [voices],
  );

  const [status, setStatus] = useState<Status>("idle");
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // false, solange die gespeicherte Stelle noch nicht übernommen oder verworfen wurde
  const [resumed, setResumed] = useState(false);
  // Position des Knopfs „Ab hier vorlesen“, solange Text im Kapitel markiert ist
  const [fromHere, setFromHere] = useState<{ top: number; left: number } | null>(null);
  const fromHereNodeRef = useRef<Node | null>(null);
  const targetKey = targetIds.join(" ");

  const segmentsRef = useRef<SpeechSegment[] | null>(null);
  // Abschnitt, der gerade gesprochen wird bzw. bei dem fortgesetzt wird
  const currentRef = useRef(0);
  // höchster bereits in die Warteschlange gelegter Abschnitt
  const queuedRef = useRef(-1);
  const tokenRef = useRef(0);
  const highlightedRef = useRef<Element | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const rateRef = useRef(settings.rate);

  useEffect(() => {
    voiceRef.current = voice;
    rateRef.current = settings.rate;
  });

  // Stelle aus dem Konto laden (gilt auf allen Geräten)
  useEffect(() => {
    let active = true;
    void fetchRemotePosition(positionKey).then((position) => {
      if (active) setRemote(position);
    });
    return () => {
      active = false;
    };
  }, [positionKey]);

  // Noch offene Stelle beim Verlassen der Seite ans Konto senden (auch beim Schließen des Tabs)
  useEffect(() => {
    const flush = () => flushRemotePosition(positionKey);
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [positionKey]);

  // Beim Verlassen der Seite die Ausgabe stoppen und die Hervorhebung entfernen.
  useEffect(() => {
    const token = tokenRef;
    const highlighted = highlightedRef;
    return () => {
      token.current++;
      if (isSupported()) window.speechSynthesis.cancel();
      highlighted.current?.classList.remove("speaking");
    };
  }, []);

  // Markierten Text im Kopf oder Kapiteltext verfolgen und den Knopf „Ab hier vorlesen“ daran ausrichten
  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const update = () => {
      const selection = window.getSelection();
      const range = selection && !selection.isCollapsed && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      const node = range?.startContainer ?? null;
      const inside = node !== null && targetKey.split(" ").some((id) => document.getElementById(id)?.contains(node));
      if (!range || !node || !inside) {
        hideTimer ??= setTimeout(() => {
          hideTimer = undefined;
          fromHereNodeRef.current = null;
          setFromHere(null);
        }, FROM_HERE_HIDE_DELAY_MS);
        return;
      }
      clearTimeout(hideTimer);
      hideTimer = undefined;
      fromHereNodeRef.current = node;
      setFromHere(fromHerePosition(range));
    };
    document.addEventListener("selectionchange", update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(hideTimer);
      document.removeEventListener("selectionchange", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetKey]);

  const segments = (): SpeechSegment[] => {
    if (!segmentsRef.current) {
      segmentsRef.current = targetIds.flatMap((id) => {
        const root = document.getElementById(id);
        return root ? extractSegments(root) : [];
      });
      setTotal(segmentsRef.current.length);
    }
    return segmentsRef.current;
  };

  const highlight = (element: Element | null) => {
    if (highlightedRef.current === element) return;
    highlightedRef.current?.classList.remove("speaking");
    highlightedRef.current = element;
    if (element) {
      element.classList.add("speaking");
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const forgetPosition = () => {
    clearPosition(positionKey);
    clearRemotePosition(positionKey);
  };

  // Kapitel zu Ende vorgelesen: Stelle löschen, beim nächsten Mal beginnt es wieder am Anfang.
  const finish = () => {
    forgetPosition();
    tokenRef.current++;
    currentRef.current = 0;
    queuedRef.current = -1;
    setIndex(0);
    setStatus("idle");
    highlight(null);
  };

  // Legt alle Textstücke eines Abschnitts in die Warteschlange. Sobald das letzte Stück beginnt,
  // folgt der nächste Abschnitt – so entstehen keine Pausen zwischen den Stücken.
  const enqueue = (segmentIndex: number, token: number) => {
    const list = segments();
    const segment = list[segmentIndex];
    if (!segment || queuedRef.current >= segmentIndex) return;
    queuedRef.current = segmentIndex;

    const chosenVoice = voiceRef.current;
    const chunks = chunkText(segment.text, chunkLimit(chosenVoice));
    chunks.forEach((text, chunkIndex) => {
      const isFirst = chunkIndex === 0;
      const isLast = chunkIndex === chunks.length - 1;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = chosenVoice?.lang ?? "de-DE";
      if (chosenVoice) utterance.voice = chosenVoice;
      utterance.rate = rateRef.current;

      utterance.onstart = () => {
        if (token !== tokenRef.current) return;
        if (isFirst) {
          currentRef.current = segmentIndex;
          setIndex(segmentIndex);
          const position = makePosition(segmentIndex, list.length, segment.text, Date.now());
          savePosition(positionKey, position);
          queueRemotePosition(positionKey, position);
          highlight(segment.element);
        }
        if (isLast) enqueue(segmentIndex + 1, token);
      };
      utterance.onend = () => {
        if (token !== tokenRef.current) return;
        if (isLast && segmentIndex === list.length - 1) finish();
      };
      utterance.onerror = (event) => {
        if (token !== tokenRef.current || event.error === "interrupted" || event.error === "canceled") return;
        // Fehler bei einem Stück: mit dem nächsten Abschnitt weitermachen statt stehen zu bleiben
        if (isLast) {
          if (segmentIndex === list.length - 1) finish();
          else enqueue(segmentIndex + 1, token);
        }
      };
      window.speechSynthesis.speak(utterance);
    });
  };

  const startAt = (segmentIndex: number) => {
    const token = ++tokenRef.current;
    window.speechSynthesis.cancel();
    queuedRef.current = segmentIndex - 1;
    currentRef.current = segmentIndex;
    setIndex(segmentIndex);
    highlight(segments()[segmentIndex]?.element ?? null);
    enqueue(segmentIndex, token);
  };

  // Beim ersten Start auf der Seite an der gespeicherten Stelle fortsetzen.
  const takeOverSaved = () => {
    if (resumed) return;
    setResumed(true);
    if (saved) currentRef.current = resolvePosition(saved, segments().map((item) => item.text));
  };

  const play = () => {
    if (segments().length === 0) return;
    takeOverSaved();
    setStatus("playing");
    startAt(currentRef.current);
  };

  const restart = () => {
    if (segments().length === 0) return;
    setResumed(true);
    forgetPosition();
    currentRef.current = 0;
    setStatus("playing");
    startAt(0);
  };

  // Pausieren bricht ab und setzt später am Anfang des aktuellen Abschnitts neu an,
  // weil speechSynthesis.pause() in Chrome unzuverlässig ist.
  const pause = () => {
    tokenRef.current++;
    window.speechSynthesis.cancel();
    setStatus("paused");
    flushRemotePosition(positionKey);
  };

  // Beenden behält die Stelle; „Vorlesen starten“ setzt dort fort, „Von vorn“ beginnt am Anfang.
  const stop = () => {
    tokenRef.current++;
    window.speechSynthesis.cancel();
    setStatus("idle");
    highlight(null);
    flushRemotePosition(positionKey);
  };

  const jump = (delta: number) => {
    const list = segments();
    const target = Math.min(Math.max(currentRef.current + delta, 0), list.length - 1);
    if (status === "playing") {
      startAt(target);
      return;
    }
    currentRef.current = target;
    setIndex(target);
    highlight(list[target]?.element ?? null);
    if (status === "idle") setStatus("paused");
  };

  // „Ab hier vorlesen“: am Anfang des markierten Abschnitts beginnen bzw. dorthin springen
  const readFromHere = () => {
    const node = fromHereNodeRef.current;
    fromHereNodeRef.current = null;
    setFromHere(null);
    window.getSelection()?.removeAllRanges();
    if (!node) return;
    const target = segmentIndexAt(segments(), node);
    if (target < 0) return;
    setResumed(true);
    setStatus("playing");
    startAt(target);
  };

  const changeSettings = (next: SpeechSettings) => {
    saveSettings(next);
    if (status === "playing") {
      rateRef.current = next.rate;
      voiceRef.current = pickVoice(voices, next.voice);
      startAt(currentRef.current);
    }
  };

  if (supported === null) return null;

  if (!supported || (voices.length > 0 && germanVoices.length === 0)) {
    return (
      <p className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-line bg-surface/95 p-3 text-sm text-muted shadow-lg backdrop-blur sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-xs">
        {supported
          ? "Vorlesen nicht möglich: In diesem Browser ist keine deutsche Stimme installiert."
          : "Vorlesen wird von diesem Browser nicht unterstützt."}
      </p>
    );
  }

  // Stelle, an der „Vorlesen starten“ fortsetzt, solange nicht vorgelesen wird
  const resumeAt = !resumed && saved ? saved.index : index;
  const resumeTotal = !resumed && saved ? saved.total : total;
  const label =
    status !== "idle"
      ? `Abschnitt ${index + 1} von ${total}`
      : resumeAt > 0
        ? `Weiter bei Abschnitt ${resumeAt + 1} von ${resumeTotal}`
        : "Kapitel vorlesen";

  return (
    <section
      aria-label="Vorlesen"
      className="fixed inset-x-3 bottom-3 z-40 sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      {/* Portal: Der Knopf liegt im DOM direkt unter body, damit „fixed“ sicher am Fenster ausgerichtet ist */}
      {fromHere &&
        createPortal(
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={readFromHere}
            style={{ top: fromHere.top, left: fromHere.left }}
            className="fixed z-50 flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition-colors hover:bg-accent-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Play aria-hidden className="size-4" />
            Ab hier vorlesen
          </button>,
          document.body,
        )}
      {settingsOpen && (
        <div className="mb-2 rounded-2xl border border-line bg-surface p-4 shadow-xl">
          <p className="font-mono text-xs font-medium tracking-wider text-muted uppercase">Geschwindigkeit</p>
          <div className="mt-2 flex gap-1" role="group" aria-label="Geschwindigkeit">
            {RATES.map((rate) => (
              <button
                key={rate}
                type="button"
                aria-pressed={settings.rate === rate}
                onClick={() => changeSettings({ ...settings, rate })}
                className={`rounded-lg px-3 py-1.5 font-mono text-sm font-semibold transition-colors ${
                  settings.rate === rate ? "bg-accent text-white" : "bg-canvas text-muted hover:text-ink"
                }`}
              >
                {String(rate).replace(".", ",")}×
              </button>
            ))}
          </div>
          {germanVoices.length > 0 && (
            <label className="mt-4 block">
              <span className="font-mono text-xs font-medium tracking-wider text-muted uppercase">Stimme</span>
              <select
                value={voice?.name ?? ""}
                onChange={(event) => changeSettings({ ...settings, voice: event.target.value })}
                className="mt-2 block w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm sm:w-72"
              >
                {germanVoices.map((item) => (
                  <option key={item.name} value={item.name}>
                    {isNaturalVoice(item) ? `${item.name} – empfohlen` : item.name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}

      <div className="flex items-center gap-1 rounded-2xl border border-line bg-surface/95 p-2 shadow-xl backdrop-blur">
        <span className="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent sm:flex">
          <Volume2 aria-hidden className="size-5" />
        </span>
        <button type="button" onClick={() => jump(-1)} disabled={status === "idle"} aria-label="Vorheriger Abschnitt" className={iconButton}>
          <SkipBack aria-hidden className="size-5" />
        </button>
        <button
          type="button"
          onClick={status === "playing" ? pause : play}
          aria-label={status === "playing" ? "Pause" : "Vorlesen starten"}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-sm shadow-accent/30 transition-colors hover:bg-accent-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {status === "playing" ? <Pause aria-hidden className="size-5" /> : <Play aria-hidden className="ml-0.5 size-5" />}
        </button>
        <button type="button" onClick={() => jump(1)} disabled={status === "idle"} aria-label="Nächster Abschnitt" className={iconButton}>
          <SkipForward aria-hidden className="size-5" />
        </button>
        <span aria-live="polite" className="min-w-0 flex-1 truncate px-2 text-sm font-semibold sm:w-40 sm:flex-none">
          {label}
        </span>
        {status !== "playing" && resumeAt > 0 && (
          <button type="button" onClick={restart} aria-label="Von vorn vorlesen" title="Von vorn" className={iconButton}>
            <RotateCcw aria-hidden className="size-4" />
          </button>
        )}
        {status !== "idle" && (
          <button type="button" onClick={stop} aria-label="Vorlesen beenden" className={iconButton}>
            <Square aria-hidden className="size-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setSettingsOpen((open) => !open)}
          aria-expanded={settingsOpen}
          aria-label="Einstellungen zum Vorlesen"
          className={iconButton}
        >
          <Settings2 aria-hidden className="size-5" />
        </button>
      </div>
    </section>
  );
}
