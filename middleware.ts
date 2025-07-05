import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register"
  ],
};

const publicRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = path.startsWith("/dashboard");
  
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Si no tiene sesión y está en ruta protegida, redirigir a login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Si tiene sesión y está en ruta pública, redirigir según su rol
  if (session && publicRoutes.includes(path)) {
    const userRoles = session.roles || [];
    
    if (userRoles.includes("admin")) {
      return NextResponse.redirect(new URL("/dashboard/admin", request.nextUrl));
    } else if (userRoles.includes("tenant")) {
      return NextResponse.redirect(new URL("/dashboard/tenant", request.nextUrl));
    } else if (userRoles.includes("guarantor")) {
      return NextResponse.redirect(new URL("/dashboard/guarantor", request.nextUrl));
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    }
  }

  // Verificar permisos por rol en rutas protegidas
  if (isProtectedRoute && session) {
    const userRoles = session.roles || [];
    
    if (path.startsWith("/dashboard/admin") && !userRoles.includes("admin")) {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    }
    if (path.startsWith("/dashboard/tenant") && !userRoles.includes("tenant")) {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    }
    if (path.startsWith("/dashboard/guarantor") && !userRoles.includes("guarantor")) {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    }
  }

  return NextResponse.next();
}