import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";

const publicRoute = "/";
const authRoutes = ["/signin", "/signup"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoute === path;
  const isAuthRoute = authRoutes.includes(path);

  // Check if user is authenticated by getting the token (not validates the session)
  const token = await getToken();
  const isAuthenticated = !!token;

  if (!isPublicRoute && !isAuthRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
} // Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
