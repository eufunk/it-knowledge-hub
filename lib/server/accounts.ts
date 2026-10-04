// F21/F22/F25: Konten und Sitzungen
import { createHash, randomBytes } from "node:crypto";
import { getDb } from "./db.ts";
import { hashPassword, verifyPassword } from "./password.ts";

export const SESSION_DAYS = 30;
export const USERNAME_PATTERN = /^[a-z0-9._-]{3,32}$/;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 200;

export interface User {
  id: number;
  username: string;
}

export interface RegistrationInput {
  username: string;
  password: string;
  passwordRepeat: string;
}

export type RegistrationErrors = Partial<Record<keyof RegistrationInput, string>>;

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function validateRegistration(input: RegistrationInput): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const username = normalizeUsername(input.username);
  if (!username) errors.username = "Bitte gib einen Benutzernamen ein.";
  else if (!USERNAME_PATTERN.test(username))
    errors.username = "3 bis 32 Zeichen: Buchstaben a–z, Ziffern, Punkt, Bindestrich oder Unterstrich.";
  if (input.password.length < PASSWORD_MIN) errors.password = `Das Passwort muss mindestens ${PASSWORD_MIN} Zeichen lang sein.`;
  else if (input.password.length > PASSWORD_MAX) errors.password = `Das Passwort darf höchstens ${PASSWORD_MAX} Zeichen lang sein.`;
  if (!errors.password && input.password !== input.passwordRepeat) errors.passwordRepeat = "Die Passwörter stimmen nicht überein.";
  return errors;
}

export class UsernameTakenError extends Error {
  constructor() {
    super("Benutzername ist bereits vergeben.");
  }
}

export function findUser(username: string): (User & { passwordHash: string }) | null {
  const row = getDb()
    .prepare("SELECT id, username, password_hash FROM users WHERE username = ?")
    .get(normalizeUsername(username)) as { id: number; username: string; password_hash: string } | undefined;
  return row ? { id: row.id, username: row.username, passwordHash: row.password_hash } : null;
}

export async function createUser(username: string, password: string): Promise<User> {
  const name = normalizeUsername(username);
  if (findUser(name)) throw new UsernameTakenError();
  const passwordHash = await hashPassword(password);
  try {
    const result = getDb()
      .prepare("INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)")
      .run(name, passwordHash, new Date().toISOString());
    return { id: Number(result.lastInsertRowid), username: name };
  } catch (error) {
    if (String(error).includes("UNIQUE")) throw new UsernameTakenError();
    throw error;
  }
}

// Gegen Zeitmessung: Auch bei unbekanntem Namen wird ein Hash berechnet.
let dummyHash: Promise<string> | null = null;

export async function authenticate(username: string, password: string): Promise<User | null> {
  const user = findUser(username);
  if (!user) {
    dummyHash ??= hashPassword("kein-konto-vorhanden");
    await verifyPassword(password, await dummyHash);
    return null;
  }
  return (await verifyPassword(password, user.passwordHash)) ? { id: user.id, username: user.username } : null;
}

function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createSession(userId: number, now: Date = new Date()): { token: string; expiresAt: Date } {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  getDb()
    .prepare("INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)")
    .run(tokenHash(token), userId, now.toISOString(), expiresAt.toISOString());
  return { token, expiresAt };
}

export function getUserBySession(token: string | undefined, now: Date = new Date()): User | null {
  if (!token) return null;
  const row = getDb()
    .prepare(
      "SELECT users.id, users.username, sessions.expires_at FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token_hash = ?",
    )
    .get(tokenHash(token)) as { id: number; username: string; expires_at: string } | undefined;
  if (!row) return null;
  if (new Date(row.expires_at) <= now) {
    deleteSession(token);
    return null;
  }
  return { id: row.id, username: row.username };
}

export function deleteSession(token: string | undefined): void {
  if (!token) return;
  getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash(token));
}
