import type { NextRequest } from "next/server";
import { isValidLesson } from "@/lib/server/progress-input";
import { getCurrentUser } from "@/lib/server/session";
import {
  deleteSpeechPosition,
  getSpeechPosition,
  MAX_POSITION_TEXT,
  saveSpeechPosition,
} from "@/lib/server/speech-positions";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

// F20: zuletzt vorgelesene Stelle eines Kapitels aus dem Konto lesen
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Nicht angemeldet" }, { status: 401, headers: NO_STORE });

  const kurs = request.nextUrl.searchParams.get("kurs");
  const kapitel = request.nextUrl.searchParams.get("kapitel");
  if (!isValidLesson(kurs, kapitel)) {
    return Response.json({ error: "Unbekannter Kurs oder Kapitel" }, { status: 400, headers: NO_STORE });
  }
  return Response.json({ stelle: getSpeechPosition(user.id, kurs, kapitel as string) }, { headers: NO_STORE });
}

// F20/F25: Stelle speichern oder löschen ({"loeschen": true}) – nur von derselben Herkunft
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== request.headers.get("host")) {
    return Response.json({ error: "Ungültige Herkunft" }, { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Nicht angemeldet" }, { status: 401 });

  let body: { kurs?: unknown; kapitel?: unknown; index?: unknown; total?: unknown; text?: unknown; loeschen?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
  if (!isValidLesson(body.kurs, body.kapitel)) {
    return Response.json({ error: "Unbekannter Kurs oder Kapitel" }, { status: 400 });
  }
  const kapitel = body.kapitel as string;

  if (body.loeschen === true) {
    deleteSpeechPosition(user.id, body.kurs, kapitel);
    return new Response(null, { status: 204 });
  }

  const { index, total, text } = body;
  if (
    !Number.isInteger(index) ||
    !Number.isInteger(total) ||
    (index as number) < 0 ||
    (total as number) < 1 ||
    (total as number) > 100_000 ||
    (index as number) >= (total as number) ||
    typeof text !== "string" ||
    text.length > MAX_POSITION_TEXT
  ) {
    return Response.json({ error: "Ungültige Stelle" }, { status: 400 });
  }

  const stelle = saveSpeechPosition(user.id, body.kurs, kapitel, { index: index as number, total: total as number, text });
  return Response.json({ stelle });
}
