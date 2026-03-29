import { NextRequest, NextResponse } from "next/server";

const MOBILE_UA_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;

const EXEMPT_PATHS = ["/mobile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (EXEMPT_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const ua = request.headers.get("user-agent") ?? "";

  if (MOBILE_UA_REGEX.test(ua)) {
    const mobileUrl = request.nextUrl.clone();
    mobileUrl.pathname = "/mobile";
    return NextResponse.redirect(mobileUrl, { status: 302 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
