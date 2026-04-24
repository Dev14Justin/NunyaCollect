import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  const role = (req.auth?.user as any)?.role as string | undefined

  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard") || 
                           nextUrl.pathname.startsWith("/collectrices") || 
                           nextUrl.pathname.startsWith("/transactions") ||
                           nextUrl.pathname.startsWith("/carte")
  const isCollectorRoute = nextUrl.pathname.startsWith("/accueil") || 
                           nextUrl.pathname.startsWith("/nouvelle-transaction")

  // Redirection selon le rôle si connecté
  if (isLoggedIn && nextUrl.pathname === "/login") {
    if (role === "COLLECTRICE") return Response.redirect(new URL("/accueil", nextUrl))
    return Response.redirect(new URL("/dashboard", nextUrl))
  }

  // Protections de routes
  if (isLoggedIn && role === "COLLECTRICE" && isDashboardRoute) {
    return Response.redirect(new URL("/accueil", nextUrl))
  }
  
  if (isLoggedIn && role !== "COLLECTRICE" && isCollectorRoute) {
    return Response.redirect(new URL("/dashboard", nextUrl))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
