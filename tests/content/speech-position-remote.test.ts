import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { makePosition } from "@/lib/utils/speech-position";
import {
  clearRemotePosition,
  fetchRemotePosition,
  flushRemotePosition,
  queueRemotePosition,
  REMOTE_SAVE_INTERVAL_MS,
} from "@/lib/utils/speech-position-remote";

const fetchMock = vi.fn();
const sentBodies = () => fetchMock.mock.calls.filter(([, init]) => init?.method === "POST").map(([, init]) => JSON.parse(init.body));

describe("F20: Vorlese-Stelle im Konto (Browser)", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("sendet höchstens alle 10 Sekunden und den Rest beim Flush", () => {
    const key = "kurs/kapitel-a";
    queueRemotePosition(key, makePosition(1, 9, "eins", 0), 1_000_000);
    queueRemotePosition(key, makePosition(2, 9, "zwei", 0), 1_003_000);
    queueRemotePosition(key, makePosition(3, 9, "drei", 0), 1_006_000);
    expect(sentBodies().map((body) => body.index)).toEqual([1]);

    flushRemotePosition(key, 1_007_000);
    expect(sentBodies().map((body) => body.index)).toEqual([1, 3]);
    flushRemotePosition(key, 1_008_000); // nichts mehr offen
    expect(sentBodies()).toHaveLength(2);

    queueRemotePosition(key, makePosition(4, 9, "vier", 0), 1_007_000 + REMOTE_SAVE_INTERVAL_MS);
    expect(sentBodies().at(-1)).toEqual({ kurs: "kurs", kapitel: "kapitel-a", index: 4, total: 9, text: "vier" });
  });

  it("löscht die Stelle und verwirft eine noch offene", () => {
    const key = "kurs/kapitel-b";
    queueRemotePosition(key, makePosition(1, 9, "eins", 0), 2_000_000);
    queueRemotePosition(key, makePosition(2, 9, "zwei", 0), 2_001_000);
    clearRemotePosition(key);
    flushRemotePosition(key, 2_002_000);
    expect(sentBodies().map((body) => body.loeschen ?? body.index)).toEqual([1, true]);
  });

  it("liest die Stelle aus dem Konto und liefert bei Fehlern null", async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ stelle: { index: 5, total: 9, text: "fünf", updatedAt: 42 } }));
    expect(await fetchRemotePosition("kurs/kapitel-c")).toEqual({ index: 5, total: 9, text: "fünf", updatedAt: 42 });
    expect(fetchMock.mock.calls[0][0]).toBe("/api/vorlesestelle?kurs=kurs&kapitel=kapitel-c");

    fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 }));
    expect(await fetchRemotePosition("kurs/kapitel-c")).toBeNull();
    fetchMock.mockRejectedValueOnce(new Error("offline"));
    expect(await fetchRemotePosition("kurs/kapitel-c")).toBeNull();
  });
});
