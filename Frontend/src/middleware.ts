import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = [
  "/profile",
  "/cart",
  "/orders",
  "/checkout",
  "/wishlist",
  "/dashboard",
  "/dashboard/products",
];

const authRoutes = ["/auth/login", "/auth/register"];

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("middleware token:", {
    exists: !!token,
    accessTokenExpires: token?.accessTokenExpires,
    now: Date.now(),
    isExpired: token ? Date.now() > token.accessTokenExpires : null,
    pathname: req.nextUrl.pathname,
    matchesProtected: protectedRoutes.includes(req.nextUrl.pathname),
  });
  const { pathname } = req.nextUrl;

  if (protectedRoutes.includes(pathname)) {
    const isExpired = token && Date.now() > token.accessTokenExpires;

    if (!token || isExpired) {
      const redirectURL = new URL("/auth/login", req.url);
      redirectURL.searchParams.set("url", pathname);

      const response = NextResponse.redirect(redirectURL);

      if (isExpired) {
        response.cookies.delete("next-auth.session-token");
        response.cookies.delete("__Secure-next-auth.session-token");
      }

      return response;
    }
  }

  if (authRoutes.includes(pathname)) {
    if (token && Date.now() < token.accessTokenExpires) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
