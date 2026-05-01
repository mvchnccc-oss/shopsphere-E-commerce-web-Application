import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const authRoutes = ["/auth/login", "/auth/register"];

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;
  const isSeller      = (token as any)?.isSeller ?? false;
  const isAuthenticated = !!token;

  // مش متسجل → روح login
  if (!isAuthenticated && !authRoutes.includes(pathname) && pathname !== "/") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // متسجل وجاي على login/register → روح home
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ── Seller ───────────────────────────────────────────────
  if (isSeller) {
    // السيلر يقدر يدخل: dashboard + profile + admin
    const sellerAllowed =
      pathname === "/profile" ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/admin");

    if (!sellerAllowed) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // ── Customer ─────────────────────────────────────────────
  if (!isSeller && isAuthenticated) {
    // الكاستومر ميدخلش dashboard ولا admin
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};