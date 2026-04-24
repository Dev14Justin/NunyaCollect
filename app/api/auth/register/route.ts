import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { nom, prenom, email, password } = await req.json()

    if (!nom || !prenom || !email || !password) {
      return new NextResponse("Champs manquants", { status: 400 })
    }

    // Vérifier si l'utilisateur existe déjà
    const userExists = await prisma.utilisateur.findUnique({
      where: { email }
    })

    if (userExists) {
      return new NextResponse("Cet email est déjà utilisé", { status: 400 })
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Récupérer l'organisation par défaut (ou en créer une si besoin pour le test)
    let organisation = await prisma.organisation.findFirst()
    
    if (!organisation) {
      organisation = await prisma.organisation.create({
        data: {
          nom: "NunyaCollect Default",
          code: "NUNYA-DEFAULT",
          email: "system@nunyacollect.com"
        }
      })
    }

    // Créer l'utilisatrice avec le rôle COLLECTRICE par défaut
    const user = await prisma.utilisateur.create({
      data: {
        nom,
        prenom,
        email,
        motDePasse: hashedPassword,
        role: "COLLECTRICE",
        statut: "ACTIVE",
        organisationId: organisation.id
      }
    })

    return NextResponse.json({
      message: "Utilisatrice créée avec succès",
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error("[REGISTER_POST]", error)
    return new NextResponse("Erreur interne du serveur", { status: 500 })
  }
}
