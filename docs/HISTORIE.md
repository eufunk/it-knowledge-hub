# Historie

Änderungen am fachlichen Verhalten, entfernte oder umbenannte Funktionen und Anforderungskennungen, jeweils mit Datum. Neueste Einträge oben.

---

## 2026-10-03
- Projekt angelegt: Feature-Spec für das MVP (`docs/feature-spec.md`, Anforderungen F1–F14), Tagesplan, ToDo-Liste und `CLAUDE.md`.
- Eigenes Design statt Nachbildung des Referenz-Screenshots: Kopfleiste oben statt dunkler Sidebar links und Bottom-Navigation (F1, F2), Kurskachel als Karte mit Bild oben und Text darunter statt Text auf dem Bild (F4), Grid mit 3 statt 4 Spalten (F3), Einheiten als Zeitleiste (F7), Inhaltsübersicht neben der Lerneinheit (F11). Farben Indigo/Grün statt Petrol, Schrift Plus Jakarta Sans statt Outfit.
- Projekt-Setup: Next.js 16 statt des in der ersten Spec-Fassung genannten Next.js 15 (aktuelle Version von create-next-app).
- Entscheidung: Repo bleibt in OneDrive, Synchronisierung wird beim Entwickeln pausiert.
- Entscheidung: dynamische Routen `app/lerninhalte/[kurs]/` und `[kurs]/[einheit]/` statt einer festen Seite pro Kurs.
