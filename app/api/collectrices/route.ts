import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Non autorisé", { status: 401 })
    }

    const collectrices = await prisma.utilisateur.findMany({
      where: {
        organisationId: (session.user as any).organisationId,
        role: "COLLECTRICE"
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        statut: true,
        createdAt: true,
        _count: {
          select: { transactions: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(collectrices)
  } catch (error) {
    console.error("[COLLECTRICES_GET]", error)
    return new NextResponse("Erreur interne", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Non autorisé", { status: 401 })
    }

    const { nom, prenom, email, password } = await req.json()

    if (!nom || !prenom || !email || !password) {
      return new NextResponse("Champs manquants", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const collectrice = await prisma.utilisateur.create({
      data: {
        nom,
        prenom,
        email,
        motDePasse: hashedPassword,
        role: "COLLECTRICE",
        statut: "ACTIVE",
        organisationId: (session.user as any).organisationId
      }
    })

    return NextResponse.json(collectrice)
  } catch (error) {
    console.error("[COLLECTRICES_POST]", error)
    return new NextResponse("Erreur lors de la création", { status: 500 })
  }
}
