import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

async function forward(req: NextRequest) {
  const backendPath = req.nextUrl.pathname.replace(/^\/api\/proxy/, "");
  const base = BACKEND_URL.replace(/\/$/, "");

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("accept-encoding");
  headers.set("x-forwarded-proto", "https");
  headers.set("x-forwarded-host", req.nextUrl.host);

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.arrayBuffer()
      : undefined;

  const makeInit = (): RequestInit => ({
    method: req.method,
    headers,
    redirect: "manual",
    ...(body ? { body } : {}),
  });

  let targetUrl = `${base}${backendPath}${req.nextUrl.search}`;
  let upstream = await fetch(targetUrl, makeInit());

  if (
    (upstream.status === 307 || upstream.status === 308) &&
    upstream.headers.get("location")
  ) {
    const location = upstream.headers.get("location")!;
    const redirected = new URL(location, targetUrl).toString();
    targetUrl = redirected;
    upstream = await fetch(targetUrl, makeInit());
  }

  const resHeaders = new Headers(upstream.headers);
  resHeaders.delete("content-encoding");
  resHeaders.delete("transfer-encoding");
  resHeaders.delete("content-length");

  if (upstream.status === 204 || upstream.status === 205) {
    return new NextResponse(null, { status: upstream.status, headers: resHeaders });
  }

  const resBody = await upstream.arrayBuffer();
  return new NextResponse(resBody, {
    status: upstream.status,
    headers: resHeaders,
  });
}

export async function GET(req: NextRequest) {
  return forward(req);
}
export async function POST(req: NextRequest) {
  return forward(req);
}
export async function PUT(req: NextRequest) {
  return forward(req);
}
export async function PATCH(req: NextRequest) {
  return forward(req);
}
export async function DELETE(req: NextRequest) {
  return forward(req);
}
