import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Use jose instead of jsonwebtoken

interface CustomJwtPayload {
  isAdmin?: boolean;
  isPantry?: boolean;
  isDelivery?: boolean;
}

async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload as CustomJwtPayload;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const url = request.nextUrl;

  // Check if the token exists
  if (!token) {
    // Redirect to /sign-in if token is missing for protected routes
    if (url.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }

  try {
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const decodedToken = await verifyToken(token);

    if (
      url.pathname === "/sign-in" ||
      url.pathname === "/sign-up" ||
      url.pathname === "/"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If the token is invalid or expired, redirect to /sign-in
    console.error("Invalid or expired token:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
