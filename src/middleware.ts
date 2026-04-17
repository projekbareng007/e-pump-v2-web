import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

const PROTECTED_ROUTES = ["/dashboard"];
const PUBLIC_ROUTES = ["/", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── API Proxy ──────────────────────────────────────────────────────────
  // All requests to /api/proxy/* are forwarded to the backend.
  // e.g. /api/proxy/auth/login  →  https://backend/auth/login
  if (pathname.startsWith("/api/proxy/")) {
    const backendPath = pathname.replace("/api/proxy", "");
    const targetUrl = new URL(backendPath, BACKEND_URL);

    // Forward original search params
    request.nextUrl.searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    // Build forwarded request headers
    const headers = new Headers(request.headers);
    headers.set("x-forwarded-host", request.nextUrl.host);
    headers.set("x-forwarded-proto", request.nextUrl.protocol.replace(":", ""));

    return NextResponse.rewrite(targetUrl, { request: { headers } });
  }

  // ── Auth Guard ─────────────────────────────────────────────────────────
  const token = request.cookies.get("auth-token")?.value;

  // Redirect authenticated users away from login page
  if (PUBLIC_ROUTES.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users away from protected routes
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  if (isProtected && !token) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Auth guard paths
    "/",
    "/register",
    "/dashboard/:path*",
    // Proxy paths
    "/api/proxy/:path*",
  ],
};
