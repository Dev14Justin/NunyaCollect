import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAuthRoute = nextUrl.pathname.startsWith("/login")
      
      // Logique de redirection de base intégrée au middleware
      if (isAuthRoute) {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl))
        return true
      }
      return isLoggedIn
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.organisationId = (user as any).organisationId
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as any
        (session.user as any).organisationId = token.organisationId as any
      }
      return session
    },
  },
  providers: [], // On laisse vide ici, on les ajoutera dans auth.ts
} satisfies NextAuthConfig
