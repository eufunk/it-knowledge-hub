import { describe, expect, it } from "vitest";
import { makePosition, parsePosition, resolvePosition } from "@/lib/utils/speech-position";

describe("F20: zuletzt vorgelesene Stelle", () => {
  it("liest gültige Angaben und verwirft kaputte", () => {
    expect(parsePosition(JSON.stringify({ index: 3, total: 10, text: "Abc" }))).toEqual({ index: 3, total: 10, text: "Abc" });
    expect(parsePosition(null)).toBeNull();
    expect(parsePosition("kein json")).toBeNull();
    expect(parsePosition(JSON.stringify({ index: -1, total: 10 }))).toBeNull();
    expect(parsePosition(JSON.stringify({ index: 1.5, total: 10 }))).toBeNull();
  });

  it("kürzt den gespeicherten Textanfang", () => {
    expect(makePosition(0, 1, "x".repeat(200)).text).toHaveLength(80);
  });

  it("findet den Abschnitt über seinen Text, auch wenn sich die Nummer verschoben hat", () => {
    const texts = ["Titel", "Neuer Absatz", "Einleitung", "Zweiter Abschnitt"];
    expect(resolvePosition(makePosition(2, 3, "Zweiter Abschnitt"), texts)).toBe(3);
  });

  it("nimmt bei mehrfachem Text den nächstgelegenen Treffer", () => {
    const texts = ["Beispiel:", "a", "Beispiel:", "b", "Beispiel:"];
    expect(resolvePosition(makePosition(3, 5, "Beispiel:"), texts)).toBe(2);
  });

  it("fällt auf die Nummer zurück und begrenzt sie auf das Kapitel", () => {
    expect(resolvePosition(makePosition(2, 5, "gibt es nicht mehr"), ["a", "b", "c", "d"])).toBe(2);
    expect(resolvePosition(makePosition(9, 10, "weg"), ["a", "b"])).toBe(1);
    expect(resolvePosition(makePosition(3, 5, "x"), [])).toBe(0);
  });
});
