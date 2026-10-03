import { describe, expect, it } from "vitest";
import { calcProgress } from "@/lib/utils/progress";

describe("F13: calcProgress", () => {
  it("liefert 0 ohne erledigte Einheiten", () => {
    expect(calcProgress(0, 5)).toBe(0);
  });

  it("liefert 20 bei einer von fünf Einheiten", () => {
    expect(calcProgress(1, 5)).toBe(20);
  });

  it("liefert 100, wenn alle Einheiten erledigt sind", () => {
    expect(calcProgress(5, 5)).toBe(100);
  });

  it("rundet auf ganze Prozent", () => {
    expect(calcProgress(1, 3)).toBe(33);
    expect(calcProgress(2, 3)).toBe(67);
  });

  it("liefert 0 bei einem Kurs ohne Einheiten", () => {
    expect(calcProgress(0, 0)).toBe(0);
  });

  it("begrenzt ungültige Werte auf 0 bis 100", () => {
    expect(calcProgress(7, 5)).toBe(100);
    expect(calcProgress(-1, 5)).toBe(0);
  });
});
