// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  authenticate,
  createSession,
  createUser,
  deleteSession,
  getUserBySession,
  SESSION_DAYS,
  UsernameTakenError,
  validateRegistration,
} from "@/lib/server/accounts";
import { closeDb, getDb } from "@/lib/server/db";
import { hashPassword, verifyPassword } from "@/lib/server/password";
import { getAllProgress, mergeProgress, setStepCompleted } from "@/lib/server/progress";
import { isValidStep, parseLocalProgress } from "@/lib/server/progress-input";
import { safeNextPath } from "@/lib/utils/redirect";

let dir: string;

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "ikh-test-"));
  process.env.IKH_DB_PATH = path.join(dir, "test.db");
});

afterEach(() => {
  closeDb();
  delete process.env.IKH_DB_PATH;
  fs.rmSync(dir, { recursive: true, force: true });
});

const KURS = "system-und-prozessautomatisierung-grundlagen";

describe("F25: Passwort-Hash", () => {
  it("speichert kein Klartext-Passwort und prüft korrekt", async () => {
    const hash = await hashPassword("testuser123");
    expect(hash).not.toContain("testuser123");
    expect(hash.startsWith("scrypt$")).toBe(true);
    expect(await verifyPassword("testuser123", hash)).toBe(true);
    expect(await verifyPassword("falsch", hash)).toBe(false);
  });

  it("verwendet ein zufälliges Salz", async () => {
    expect(await hashPassword("gleich")).not.toBe(await hashPassword("gleich"));
  });

  it("lehnt unbekannte Formate ab", async () => {
    expect(await verifyPassword("x", "md5$abc")).toBe(false);
  });
});

describe("F21: Registrierung", () => {
  it("prüft Benutzername und Passwort", () => {
    expect(validateRegistration({ username: "ab", password: "12345678", passwordRepeat: "12345678" }).username).toBeTruthy();
    expect(validateRegistration({ username: "mit leerzeichen", password: "12345678", passwordRepeat: "12345678" }).username).toBeTruthy();
    expect(validateRegistration({ username: "anna", password: "kurz", passwordRepeat: "kurz" }).password).toBeTruthy();
    expect(validateRegistration({ username: "anna", password: "12345678", passwordRepeat: "87654321" }).passwordRepeat).toBeTruthy();
    expect(validateRegistration({ username: "Anna.M-1_", password: "12345678", passwordRepeat: "12345678" })).toEqual({});
  });

  it("legt Konten an und lehnt vergebene Namen ohne Rücksicht auf Groß-/Kleinschreibung ab", async () => {
    const user = await createUser("TestUser", "testuser123");
    expect(user.username).toBe("testuser");
    await expect(createUser("testuser", "anderes-passwort")).rejects.toBeInstanceOf(UsernameTakenError);
    await expect(createUser("TESTUSER", "anderes-passwort")).rejects.toBeInstanceOf(UsernameTakenError);
  });
});

describe("F22: Anmeldung und Sitzung", () => {
  it("meldet mit richtigem Passwort an, sonst nicht", async () => {
    await createUser("testuser", "testuser123");
    expect(await authenticate("testuser", "testuser123")).toMatchObject({ username: "testuser" });
    expect(await authenticate("TestUser", "testuser123")).toMatchObject({ username: "testuser" });
    expect(await authenticate("testuser", "falsch")).toBeNull();
    expect(await authenticate("gibt-es-nicht", "testuser123")).toBeNull();
  });

  it("speichert nur den Hash des Sitzungs-Tokens", async () => {
    const user = await createUser("testuser", "testuser123");
    const { token } = createSession(user.id);
    const stored = getDb().prepare("SELECT token_hash FROM sessions").all() as { token_hash: string }[];
    expect(stored).toHaveLength(1);
    expect(stored[0].token_hash).not.toBe(token);
    expect(getUserBySession(token)).toMatchObject({ id: user.id, username: "testuser" });
    expect(getUserBySession("falsches-token")).toBeNull();
    expect(getUserBySession(undefined)).toBeNull();
  });

  it("lässt Sitzungen nach 30 Tagen ablaufen und löscht sie beim Abmelden", async () => {
    const user = await createUser("testuser", "testuser123");
    const start = new Date("2026-10-04T12:00:00Z");
    const { token, expiresAt } = createSession(user.id, start);
    expect(expiresAt.getTime() - start.getTime()).toBe(SESSION_DAYS * 24 * 60 * 60 * 1000);
    expect(getUserBySession(token, new Date("2026-11-02T12:00:00Z"))).not.toBeNull();
    expect(getUserBySession(token, new Date("2026-11-04T12:00:01Z"))).toBeNull();

    const second = createSession(user.id);
    deleteSession(second.token);
    expect(getUserBySession(second.token)).toBeNull();
  });
});

describe("F23/F24: Fortschritt im Konto", () => {
  it("speichert, liest und entfernt Lernschritte je Kurs", async () => {
    const user = await createUser("testuser", "testuser123");
    setStepCompleted(user.id, KURS, "einfuehrung-systemautomatisierung", true);
    setStepCompleted(user.id, KURS, "einfuehrung-systemautomatisierung/wissenstest", true);
    setStepCompleted(user.id, KURS, "einfuehrung-systemautomatisierung", true);
    expect(getAllProgress(user.id)[KURS]).toHaveLength(2);

    setStepCompleted(user.id, KURS, "einfuehrung-systemautomatisierung", false);
    expect(getAllProgress(user.id)).toEqual({ [KURS]: ["einfuehrung-systemautomatisierung/wissenstest"] });
  });

  it("führt Browser-Fortschritt zusammen, ohne Vorhandenes zu verlieren", async () => {
    const user = await createUser("testuser", "testuser123");
    setStepCompleted(user.id, KURS, "bash-und-shell-scripting", true);
    mergeProgress(user.id, { [KURS]: ["einfuehrung-systemautomatisierung", "bash-und-shell-scripting"] });
    expect(new Set(getAllProgress(user.id)[KURS])).toEqual(new Set(["bash-und-shell-scripting", "einfuehrung-systemautomatisierung"]));
  });

  it("trennt den Fortschritt verschiedener Konten", async () => {
    const anna = await createUser("anna", "passwort-anna");
    const ben = await createUser("ben", "passwort-ben");
    setStepCompleted(anna.id, KURS, "einfuehrung-systemautomatisierung", true);
    expect(getAllProgress(ben.id)).toEqual({});
  });

  it("übernimmt nur existierende Kurse und Lernschritte aus dem Browser", () => {
    const raw = JSON.stringify({
      [KURS]: ["einfuehrung-systemautomatisierung", "gibt-es-nicht", 42, "glossar", "einfuehrung-systemautomatisierung"],
      "unbekannter-kurs": ["x"],
    });
    expect(parseLocalProgress(raw)).toEqual({ [KURS]: ["einfuehrung-systemautomatisierung"] });
    expect(parseLocalProgress("kein json")).toEqual({});
    expect(parseLocalProgress(null)).toEqual({});
    expect(parseLocalProgress("[1,2]")).toEqual({});
  });

  it("erkennt gültige Lernschritte", () => {
    expect(isValidStep(KURS, "powershell-basics/wissenstest")).toBe(true);
    expect(isValidStep(KURS, "glossar")).toBe(false);
    expect(isValidStep("../etc", "x")).toBe(false);
    expect(isValidStep(KURS, 1)).toBe(false);
  });
});

describe("Weiterleitung nach dem Anmelden", () => {
  it("lässt nur interne Pfade zu", () => {
    expect(safeNextPath("/lerninhalte/kurs")).toBe("/lerninhalte/kurs");
    expect(safeNextPath("https://boese.example")).toBe("/lerninhalte");
    expect(safeNextPath("//boese.example")).toBe("/lerninhalte");
    expect(safeNextPath("/\\boese.example")).toBe("/lerninhalte");
    expect(safeNextPath("/anmelden")).toBe("/lerninhalte");
    expect(safeNextPath(undefined)).toBe("/lerninhalte");
  });
});
