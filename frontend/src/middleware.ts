import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Simple check for our JWT token in cookies
  // Note: For a real production app, you would verify the JWT signature here
  // or use next-auth. For this MVP, we just check existence to prevent basic unauthorized access.
  const token = request.cookies.get("auth-storage");
  const isLoginPage = request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register";

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
