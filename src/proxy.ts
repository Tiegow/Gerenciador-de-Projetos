import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

const publicPaths = ["/login", "/register"]

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  // Sempre permitir rotas de API do NextAuth
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // Se está logado e tenta acessar login/registro → redireciona para dashboard
  if (isLoggedIn && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Se NÃO está logado e tenta acessar área protegida → redireciona para login
  if (!isLoggedIn && !isPublicPath && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Landing page (/) → redireciona conforme status de autenticação
  if (pathname === "/") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
