import { NextResponse, type NextRequest } from "next/server";
import { CONTENT_DIR, getCourseRelease } from "@/lib/content/course-meta";
import { getUserBySession, SESSION_COOKIE } from "@/lib/server/accounts";
import { courseSlugFromPath, isCourseVisible, localDate } from "@/lib/utils/release";

// F26: Lerninhalte nur mit gültiger Sitzung; sonst zur Anmeldung und danach zurück zur gewünschten Seite.
// Läuft in Next 16 standardmäßig mit Node.js und kann daher die Sitzung in der Datenbank prüfen.
// Schnittstellen und Server Actions prüfen die Anmeldung zusätzlich selbst (nicht allein auf den Proxy verlassen).
// F28: Noch nicht freigegebene Kurse führen zur Kursübersicht, außer für Tester.
export function proxy(request: NextRequest) {
  const user = getUserBySession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!user) {
    const login = new URL("/anmelden", request.url);
    login.searchParams.set("weiter", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(login);
  }

  const slug = courseSlugFromPath(request.nextUrl.pathname);
  if (slug) {
    // IKH_CONTENT_DIR lenkt den Inhaltsordner in Tests um (wie IKH_DB_PATH die Datenbank)
    const release = getCourseRelease(slug, process.env.IKH_CONTENT_DIR ?? CONTENT_DIR);
    if (!isCourseVisible(release, user, localDate(new Date()))) {
      return NextResponse.redirect(new URL("/lerninhalte", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/lerninhalte", "/lerninhalte/:path*"],
};
