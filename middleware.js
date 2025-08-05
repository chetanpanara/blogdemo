import  jwt  from "jsonwebtoken";
import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Simulated authToken - in real case, read from cookies or headers
 const token = request.cookies.get("auth-token")?.value;
  const authToken = token; // Set to false to simulate not logged in

  const isProtectedRoute = pathname.startsWith("/admin");
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/blogs" 

  // 1. If accessing protected route without token → redirect to /login
  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. If accessing login or home while already logged in → redirect to /admin
  if (isPublicRoute && authToken) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // 3. Otherwise, allow
  return NextResponse.next();
}
