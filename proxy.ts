import { NextResponse, type NextRequest } from "next/server";
import { getUserBySession, SESSION_COOKIE } from "@/lib/server/accounts";

// F26: Lerninhalte nur mit gültiger Sitzung; sonst zur Anmeldung und danach zurück zur gewünschten Seite.
// Läuft in Next 16 standardmäßig mit Node.js und kann daher die Sitzung in der Datenbank prüfen.
// Schnittstellen und Server Actions prüfen die Anmeldung zusätzlich selbst (nicht allein auf den Proxy verlassen).
export function proxy(request: NextRequest) {
  if (getUserBySession(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();

  const login = new URL("/anmelden", request.url);
  login.searchParams.set("weiter", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/lerninhalte", "/lerninhalte/:path*"],
};
