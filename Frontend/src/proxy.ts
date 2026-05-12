import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const authRoutes = ["/auth/login", "/auth/register"];
const publicRoutes = ["/", "/products", "/categories"];

function isPublicRoute(pathname: string) {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const role = (token as any)?.role ?? "ROLE_CUSTOMER";


  const isSeller = role === "Seller" || role === "ROLE_SELLER";
  const isAdmin = role === "Admin" || role === "ROLE_ADMIN";
  const isAuthenticated = !!token;

  // مش متسجل → روح login
  if (
    !isAuthenticated &&
    !authRoutes.includes(pathname) &&
    !isPublicRoute(pathname)
  ) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // متسجل وجاي على login/register → روح home
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ── Seller ───────────────────────────────────────────────
  if (isSeller) {
    const sellerAllowed =
      pathname === "/profile" || pathname.startsWith("/dashboard");

    if (!sellerAllowed) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // ── Admin ───────────────────────────────────────────────
  if (isAdmin) {
    const adminAllowed =
      pathname === "/profile" || pathname.startsWith("/admin");

    if (!adminAllowed) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // ── Customer ─────────────────────────────────────────────
  if (!isSeller && !isAdmin && isAuthenticated) {
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
