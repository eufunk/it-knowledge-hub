import { getAllProgress } from "@/lib/server/progress";
import { getCurrentUser } from "@/lib/server/session";

export const dynamic = "force-dynamic";

// F22/F23: Anmeldestatus und Fortschritt für den Browser
export async function GET() {
  const user = await getCurrentUser();
  const body = user ? { user: { username: user.username }, progress: getAllProgress(user.id) } : { user: null, progress: {} };
  return Response.json(body, { headers: { "Cache-Control": "no-store" } });
}
