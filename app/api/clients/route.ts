import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Non autorisé", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")

    const clients = await prisma.client.findMany({
      where: {
        organisationId: (session.user as any).organisationId,
        actif: true,
        OR: query ? [
          { nom: { contains: query, mode: 'insensitive' } },
          { prenom: { contains: query, mode: 'insensitive' } },
          { telephone: { contains: query } },
          { numeroCarte: { contains: query } }
        ] : undefined
      },
      orderBy: { nom: "asc" },
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error("[CLIENTS_GET]", error)
    return new NextResponse("Erreur interne", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Non autorisé", { status: 401 })
    }

    const { nom, prenom, telephone, numeroCarte, adresse } = await req.json()

    if (!nom || !prenom || !telephone || !numeroCarte) {
      return new NextResponse("Champs manquants", { status: 400 })
    }

    // Vérifier si le numéro de carte est déjà utilisé
    const existing = await prisma.client.findUnique({
      where: { numeroCarte }
    })

    if (existing) {
      return new NextResponse("Ce numéro de carte est déjà utilisé", { status: 400 })
    }

    const client = await prisma.client.create({
      data: {
        nom,
        prenom,
        telephone,
        numeroCarte,
        adresse,
        organisationId: (session.user as any).organisationId
      }
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error("[CLIENTS_POST]", error)
    return new NextResponse("Erreur lors de la création", { status: 500 })
  }
}
