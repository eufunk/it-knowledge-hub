import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAccountState, resetAccountStore } from "@/lib/utils/account-store";
import { collectLocalProgress, parseCompleted, readProgressRaw, setLessonCompleted } from "@/lib/utils/progress-store";

const KURS = "kurs-a";

describe("F23: Fortschritt mit Konto", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    resetAccountStore();
    vi.unstubAllGlobals();
  });

  it("liest ohne Anmeldung aus dem Browser", () => {
    resetAccountStore({ status: "anonymous", username: null, progress: {} });
    setLessonCompleted(KURS, "einfuehrung", true);
    expect(parseCompleted(readProgressRaw(KURS))).toEqual(["einfuehrung"]);
  });

  it("liest und speichert angemeldet im Konto statt im Browser", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    window.localStorage.setItem("progress:v1:kurs-a", JSON.stringify(["nur-lokal"]));
    resetAccountStore({ status: "user", username: "testuser", progress: { [KURS]: JSON.stringify(["im-konto"]) } });

    expect(parseCompleted(readProgressRaw(KURS))).toEqual(["im-konto"]);

    setLessonCompleted(KURS, "neu", true);
    expect(parseCompleted(readProgressRaw(KURS))).toEqual(["im-konto", "neu"]);
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/fortschritt");
    expect(JSON.parse(init.body as string)).toEqual({ kurs: KURS, schritt: "neu", erledigt: true });
    expect(window.localStorage.getItem("progress:v1:kurs-a")).toBe(JSON.stringify(["nur-lokal"]));
  });

  it("nimmt die Änderung zurück, wenn das Speichern scheitert", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 500 })));
    vi.spyOn(console, "error").mockImplementation(() => {});
    resetAccountStore({ status: "user", username: "testuser", progress: {} });

    setLessonCompleted(KURS, "neu", true);
    expect(parseCompleted(readProgressRaw(KURS))).toEqual(["neu"]);
    await vi.waitFor(() => expect(parseCompleted(readProgressRaw(KURS))).toEqual([]));
    expect(getAccountState().status).toBe("user");
  });

  it("wartet beim Speichern, bis der Anmeldestatus geladen ist", async () => {
    const fetchMock = vi.fn(async (url: string) =>
      url === "/api/sitzung"
        ? Response.json({ user: { username: "testuser" }, progress: {} })
        : new Response(null, { status: 204 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    resetAccountStore();

    setLessonCompleted(KURS, "schnell-geklickt", true);
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/fortschritt", expect.anything()));
    expect(parseCompleted(readProgressRaw(KURS))).toEqual(["schnell-geklickt"]);
    expect(window.localStorage.getItem("progress:v1:kurs-a")).toBeNull();
  });

  it("sammelt den Browser-Fortschritt aller Kurse für die Übernahme (F24)", () => {
    window.localStorage.setItem("progress:v1:kurs-a", JSON.stringify(["a", "b"]));
    window.localStorage.setItem("progress:v1:kurs-b", JSON.stringify([]));
    window.localStorage.setItem("vorlesen:v1", JSON.stringify({ rate: 1 }));
    expect(collectLocalProgress()).toEqual({ "kurs-a": ["a", "b"] });
  });
});
