// F23/F25: SQLite-Datenbank über das in Node eingebaute node:sqlite (kein natives Zusatzpaket).
// Nur relative Importe mit .ts-Endung, damit das Modul auch direkt mit Node läuft (scripts/db-seed.ts).
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  created_at    TEXT    NOT NULL,
  tester        INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT    PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT    NOT NULL,
  expires_at TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS progress (
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_slug  TEXT    NOT NULL,
  step_id      TEXT    NOT NULL,
  completed_at TEXT    NOT NULL,
  PRIMARY KEY (user_id, course_slug, step_id)
);

-- F20: zuletzt vorgelesene Stelle je Kapitel
CREATE TABLE IF NOT EXISTS speech_positions (
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_slug TEXT    NOT NULL,
  lesson_slug TEXT    NOT NULL,
  position    INTEGER NOT NULL,
  total       INTEGER NOT NULL,
  text        TEXT    NOT NULL,
  updated_at  TEXT    NOT NULL,
  PRIMARY KEY (user_id, course_slug, lesson_slug)
);
`;

// Pfad zentral; mit IKH_DB_PATH umlenkbar (Tests, andere Installationen)
export function databasePath(): string {
  return process.env.IKH_DB_PATH ?? path.join(process.cwd(), "data", "it-knowledge-hub.db");
}

let current: { file: string; db: DatabaseSync } | null = null;

export function getDb(): DatabaseSync {
  const file = databasePath();
  if (current?.file === file) return current.db;
  closeDb();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
  db.exec(SCHEMA);
  migrate(db);
  current = { file, db };
  return db;
}

// Ältere Datenbanken nachrüsten (Spalten, die nach dem ersten Anlegen dazugekommen sind)
function migrate(db: DatabaseSync): void {
  const columns = db.prepare("PRAGMA table_info(users)").all() as { name: string }[];
  // F28: Tester-Merkmal
  if (!columns.some((column) => column.name === "tester")) {
    db.exec("ALTER TABLE users ADD COLUMN tester INTEGER NOT NULL DEFAULT 0");
  }
}

export function closeDb(): void {
  current?.db.close();
  current = null;
}
