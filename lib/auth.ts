import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.utilisateur.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.motDePasse) return null

        const isValid = await bcrypt.compare(credentials.password as string, user.motDePasse)

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: `${user.prenom} ${user.nom}`,
          role: user.role,
          organisationId: user.organisationId,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.organisationId = (user as any).organisationId
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
        (session.user as any).organisationId = token.organisationId
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
