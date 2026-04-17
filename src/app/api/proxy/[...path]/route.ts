import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

async function forward(req: NextRequest, path: string[]) {
  const target = new URL(
    `${path.join("/")}${req.nextUrl.search}`,
    // ensure single slash join
    BACKEND_URL.endsWith("/") ? BACKEND_URL : `${BACKEND_URL}/`,
  );

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.set("x-forwarded-proto", "https");
  headers.set("x-forwarded-host", req.nextUrl.host);

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "follow",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  const upstream = await fetch(target.toString(), init);

  const resHeaders = new Headers(upstream.headers);
  resHeaders.delete("content-encoding");
  resHeaders.delete("transfer-encoding");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
