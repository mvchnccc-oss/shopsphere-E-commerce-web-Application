import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/profile",
  "/cart",
  "/orders",
  "/checkout",
  "/wishlist",
  "/dashboard",
  "/dashboard/products"
];

const authRoutes = ["/auth/login", "/auth/register"];

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isTokenExpired = token && (token as any).error === "AccessTokenError";

  // Redirect unauthenticated or expired-token users away from protected routes
  if (protectedRoutes.includes(pathname)) {
    if (!token || isTokenExpired) {
      const redirectURL = new URL("/auth/login", req.url);
      redirectURL.searchParams.set("url", pathname);
      return NextResponse.redirect(redirectURL);
    }
  }

  if (authRoutes.includes(pathname)) {
    if (token && !isTokenExpired) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
