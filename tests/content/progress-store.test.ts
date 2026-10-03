import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  parseCompleted,
  progressKey,
  readProgressRaw,
  setLessonCompleted,
  subscribeProgress,
} from "@/lib/utils/progress-store";

describe("F12: Fortschritt im localStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("speichert erledigte Einheiten pro Kurs", () => {
    setLessonCompleted("kurs-a", "einfuehrung", true);
    setLessonCompleted("kurs-a", "grundlagen", true);
    setLessonCompleted("kurs-b", "einfuehrung", true);

    expect(parseCompleted(readProgressRaw("kurs-a"))).toEqual(["einfuehrung", "grundlagen"]);
    expect(parseCompleted(readProgressRaw("kurs-b"))).toEqual(["einfuehrung"]);
  });

  it("nimmt eine Einheit wieder heraus, ohne Duplikate", () => {
    setLessonCompleted("kurs-a", "einfuehrung", true);
    setLessonCompleted("kurs-a", "einfuehrung", true);
    expect(parseCompleted(readProgressRaw("kurs-a"))).toEqual(["einfuehrung"]);

    setLessonCompleted("kurs-a", "einfuehrung", false);
    expect(parseCompleted(readProgressRaw("kurs-a"))).toEqual([]);
  });

  it("benachrichtigt Abonnenten bei Änderungen", () => {
    const onChange = vi.fn();
    const unsubscribe = subscribeProgress(onChange);
    setLessonCompleted("kurs-a", "einfuehrung", true);
    unsubscribe();
    setLessonCompleted("kurs-a", "grundlagen", true);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe("F14: robuster Umgang mit fehlendem oder kaputtem Speicher", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("liefert eine leere Liste für fehlende oder ungültige Daten", () => {
    expect(parseCompleted(null)).toEqual([]);
    expect(parseCompleted("kein json")).toEqual([]);
    expect(parseCompleted('{"a":1}')).toEqual([]);
    expect(parseCompleted('["a", 3, null]')).toEqual(["a"]);
  });

  it("stürzt nicht ab, wenn localStorage blockiert ist", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blockiert");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blockiert");
    });

    expect(readProgressRaw("kurs-a")).toBeNull();
    expect(() => setLessonCompleted("kurs-a", "einfuehrung", true)).not.toThrow();
  });

  it("verwendet einen versionierten Schlüssel", () => {
    expect(progressKey("kurs-a")).toBe("progress:v1:kurs-a");
  });
});
