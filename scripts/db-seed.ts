// Entwicklungsskript: legt das Testkonto an (F25 – nie automatisch, nur über `npm run db:seed`).
// Läuft direkt mit Node (Typen werden entfernt), daher relative Importe mit .ts-Endung.
import { createUser, findUser } from "../lib/server/accounts.ts";
import { closeDb, databasePath } from "../lib/server/db.ts";

const USERNAME = "testuser";
const PASSWORD = "testuser123";

if (process.env.NODE_ENV === "production") {
  console.error("Abbruch: Das Testkonto wird in Produktion nicht angelegt.");
  process.exit(1);
}

if (findUser(USERNAME)) {
  console.log(`Testkonto „${USERNAME}“ existiert bereits (${databasePath()}).`);
} else {
  await createUser(USERNAME, PASSWORD);
  console.log(`Testkonto „${USERNAME}“ angelegt (${databasePath()}).`);
}
closeDb();
