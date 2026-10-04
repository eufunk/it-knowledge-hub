import { setStepCompleted } from "@/lib/server/progress";
import { isValidStep } from "@/lib/server/progress-input";
import { getCurrentUser } from "@/lib/server/session";

// F23/F25: Lernschritt für angemeldete Nutzer speichern – nur von derselben Herkunft
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== request.headers.get("host")) {
    return Response.json({ error: "Ungültige Herkunft" }, { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Nicht angemeldet" }, { status: 401 });

  let body: { kurs?: unknown; schritt?: unknown; erledigt?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
  if (!isValidStep(body.kurs, body.schritt) || typeof body.erledigt !== "boolean") {
    return Response.json({ error: "Unbekannter Kurs oder Lernschritt" }, { status: 400 });
  }

  setStepCompleted(user.id, body.kurs, body.schritt as string, body.erledigt);
  return new Response(null, { status: 204 });
}
