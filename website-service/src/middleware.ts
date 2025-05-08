import { getEmployeeSession } from "@/lib/sessionEmployee";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// =============================================================================================================================

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const urlsAllowed = ["/panel/connexion"];

  const session = await getEmployeeSession();

  if (session && (url === "/panel/connexion" || url === "/panel")) {
    return NextResponse.redirect(new URL("/panel/tableau-de-bord", request.url));
  }

  if (!session && url.startsWith("/panel") && !urlsAllowed.includes(url)) {
    return NextResponse.redirect(new URL("/panel/connexion", request.url));
  }

  return NextResponse.next();
}

// =============================================================================================================================

export const config = {
  matcher: [
    "/panel/:path*((?!api|_next/static|_next/image|robots\\.txt|sitemap\\.xml|.*\\.png$|.*\\.ico$|.*\\.svg$|.*\\.jpg$).*)",
  ],
};

// =============================================================================================================================
