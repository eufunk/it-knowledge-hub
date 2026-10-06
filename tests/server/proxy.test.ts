// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { config, proxy } from "@/proxy";
import { createSession, createUser, SESSION_COOKIE, setTester } from "@/lib/server/accounts";
import { closeDb } from "@/lib/server/db";

let dir: string;

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "ikh-proxy-"));
  process.env.IKH_DB_PATH = path.join(dir, "test.db");
  process.env.IKH_CONTENT_DIR = path.join(import.meta.dirname, "..", "content", "fixtures", "lerninhalte");
});

afterEach(() => {
  closeDb();
  delete process.env.IKH_DB_PATH;
  delete process.env.IKH_CONTENT_DIR;
  fs.rmSync(dir, { recursive: true, force: true });
});

function request(pathname: string, token?: string): NextRequest {
  return new NextRequest(new URL(pathname, "http://localhost:3001"), {
    headers: token ? { cookie: `${SESSION_COOKIE}=${token}` } : {},
  });
}

describe("F26: Zugangsschutz", () => {
  it("schützt alle Seiten unter /lerninhalte", () => {
    expect(config.matcher).toEqual(["/lerninhalte", "/lerninhalte/:path*"]);
  });

  it("leitet ohne Sitzung zur Anmeldung und merkt sich die Seite", () => {
    const response = proxy(request("/lerninhalte/kurs/kapitel?x=1"));
    expect(response.status).toBe(307);
    const target = new URL(response.headers.get("location")!);
    expect(target.pathname).toBe("/anmelden");
    expect(target.searchParams.get("weiter")).toBe("/lerninhalte/kurs/kapitel?x=1");
  });

  it("leitet bei ungültiger oder abgelaufener Sitzung zur Anmeldung", async () => {
    expect(proxy(request("/lerninhalte", "ausgedacht")).status).toBe(307);

    const user = await createUser("testuser", "testuser123");
    const { token } = createSession(user.id, new Date("2020-01-01T00:00:00Z"));
    expect(proxy(request("/lerninhalte", token)).status).toBe(307);
  });

  it("lässt angemeldete Nutzer durch", async () => {
    const user = await createUser("testuser", "testuser123");
    const { token } = createSession(user.id);
    const response = proxy(request("/lerninhalte", token));
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});

describe("F28: Kursfreigabe im Proxy", () => {
  it("leitet bei noch nicht freigegebenen Kursen zur Kursübersicht", async () => {
    const user = await createUser("anna", "geheim-123");
    const { token } = createSession(user.id);
    const response = proxy(request("/lerninhalte/kurs-b/eins", token));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get("location")!).pathname).toBe("/lerninhalte");
    expect(proxy(request("/lerninhalte/kurs-a", token)).headers.get("x-middleware-next")).toBe("1");
  });

  it("lässt Tester auch in noch nicht freigegebene Kurse", async () => {
    const user = await createUser("testuser", "testuser123");
    setTester("testuser", true);
    const { token } = createSession(user.id);
    expect(proxy(request("/lerninhalte/kurs-b/eins", token)).headers.get("x-middleware-next")).toBe("1");
  });
});
