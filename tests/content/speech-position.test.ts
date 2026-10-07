import { describe, expect, it } from "vitest";
import { makePosition, newerPosition, parsePosition, resolvePosition } from "@/lib/utils/speech-position";

describe("F20: zuletzt vorgelesene Stelle", () => {
  it("liest gültige Angaben und verwirft kaputte", () => {
    expect(parsePosition(JSON.stringify({ index: 3, total: 10, text: "Abc", updatedAt: 5 }))).toEqual({ index: 3, total: 10, text: "Abc", updatedAt: 5 });
    // ältere Einträge ohne Zeitstempel gelten als alt
    expect(parsePosition(JSON.stringify({ index: 3, total: 10, text: "Abc" }))?.updatedAt).toBe(0);
    expect(parsePosition(null)).toBeNull();
    expect(parsePosition("kein json")).toBeNull();
    expect(parsePosition(JSON.stringify({ index: -1, total: 10 }))).toBeNull();
    expect(parsePosition(JSON.stringify({ index: 1.5, total: 10 }))).toBeNull();
  });

  it("kürzt den gespeicherten Textanfang", () => {
    expect(makePosition(0, 1, "x".repeat(200), 0).text).toHaveLength(80);
  });

  it("findet den Abschnitt über seinen Text, auch wenn sich die Nummer verschoben hat", () => {
    const texts = ["Titel", "Neuer Absatz", "Einleitung", "Zweiter Abschnitt"];
    expect(resolvePosition(makePosition(2, 3, "Zweiter Abschnitt", 0), texts)).toBe(3);
  });

  it("nimmt bei mehrfachem Text den nächstgelegenen Treffer", () => {
    const texts = ["Beispiel:", "a", "Beispiel:", "b", "Beispiel:"];
    expect(resolvePosition(makePosition(3, 5, "Beispiel:", 0), texts)).toBe(2);
  });

  it("fällt auf die Nummer zurück und begrenzt sie auf das Kapitel", () => {
    expect(resolvePosition(makePosition(2, 5, "gibt es nicht mehr", 0), ["a", "b", "c", "d"])).toBe(2);
    expect(resolvePosition(makePosition(9, 10, "weg", 0), ["a", "b"])).toBe(1);
    expect(resolvePosition(makePosition(3, 5, "x", 0), [])).toBe(0);
  });

  it("nimmt von Browser- und Kontostelle die zuletzt gespeicherte", () => {
    const browser = makePosition(4, 10, "Browser", 2000);
    const konto = makePosition(8, 10, "Konto", 1000);
    expect(newerPosition(browser, konto)).toBe(browser);
    expect(newerPosition(makePosition(4, 10, "alt", 500), konto)).toBe(konto);
    expect(newerPosition(null, konto)).toBe(konto);
    expect(newerPosition(browser, null)).toBe(browser);
    expect(newerPosition(null, null)).toBeNull();
  });
});
