import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  const role = req.auth?.user?.role as string | undefined

  const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard") || 
                           nextUrl.pathname.startsWith("/collectrices") || 
                           nextUrl.pathname.startsWith("/transactions") ||
                           nextUrl.pathname.startsWith("/carte") ||
                           nextUrl.pathname.startsWith("/rapports") ||
                           nextUrl.pathname.startsWith("/alertes")
  const isCollectorRoute = nextUrl.pathname.startsWith("/accueil") || 
                           nextUrl.pathname.startsWith("/nouvelle-transaction") ||
                           nextUrl.pathname.startsWith("/mes-transactions")

  // 1. Rediriger vers login si non connecté et tente d'accéder à une route protégée
  if (!isLoggedIn && (isDashboardRoute || isCollectorRoute)) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  // 2. Rediriger vers la bonne page d'accueil si déjà connecté et sur la page login
  if (isLoggedIn && isAuthRoute) {
    if (role === "COLLECTRICE") {
      return NextResponse.redirect(new URL("/accueil", nextUrl))
    }
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // 3. Protection par rôle : Empêcher collectrice d'aller sur le dashboard admin
  if (isLoggedIn && role === "COLLECTRICE" && isDashboardRoute) {
    return NextResponse.redirect(new URL("/accueil", nextUrl))
  }

  // 4. Protection par rôle : Empêcher admin d'aller sur l'interface collectrice mobile
  if (isLoggedIn && role !== "COLLECTRICE" && isCollectorRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
