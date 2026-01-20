import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dsp"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token");

  if (
    protectedRoutes.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    )
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dsp/:path*"],
};
