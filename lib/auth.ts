import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { authConfig } from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("Tentative de connexion pour:", credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Email ou mot de passe manquant")
          return null
        }

        try {
          const user = await prisma.utilisateur.findUnique({
            where: { email: credentials.email as string },
          })

          if (!user) {
            console.log("Utilisateur non trouvé dans la DB")
            return null
          }

          if (!user.motDePasse) {
            console.log("L'utilisateur n'a pas de mot de passe enregistré")
            return null
          }

          const isValid = await bcrypt.compare(
            credentials.password as string, 
            user.motDePasse
          )

          if (!isValid) {
            console.log("Mot de passe incorrect")
            return null
          }

          console.log("Connexion réussie pour:", user.email)
          
          return {
            id: user.id,
            email: user.email,
            name: `${user.prenom} ${user.nom}`,
            role: user.role,
            organisationId: user.organisationId,
          }
        } catch (error) {
          console.error("Erreur technique lors de l'autorisation:", error)
          return null
        }
      },
    }),
  ],
})
