import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { TypeTransaction } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Non autorisé", { status: 401 })
    }

    const body = await req.json()
    const { 
      montant, 
      type, 
      clientId, 
      latitude, 
      longitude, 
      note 
    } = body

    // 1. Valider les données
    if (!montant || !clientId || !type) {
      return new NextResponse("Données manquantes", { status: 400 })
    }

    // 2. Créer la transaction et mettre à jour le solde du client dans une transaction Prisma
    const result = await prisma.$transaction(async (tx) => {
      // Créer la transaction
      const transaction = await tx.transaction.create({
        data: {
          montant,
          type: type as TypeTransaction,
          clientId,
          collectriceId: (session.user as any).id,
          latitude,
          longitude,
          note,
          statut: "CONFIRMEE", // Par défaut confirmée pour le MVP
        }
      })

      // Mettre à jour le solde du client
      const adjustment = type === "DEPOT" ? montant : -montant
      await tx.client.update({
        where: { id: clientId },
        data: {
          solde: {
            increment: adjustment
          }
        }
      })

      return transaction
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("[TRANSACTIONS_POST]", error)
    return new NextResponse("Erreur interne", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Non autorisé", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const collectriceId = searchParams.get("collectriceId")

    const transactions = await prisma.transaction.findMany({
      where: {
        ...(collectriceId ? { collectriceId } : {}),
        collectrice: {
          organisationId: (session.user as any).organisationId
        }
      },
      include: {
        client: true,
        collectrice: true,
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("[TRANSACTIONS_GET]", error)
    return new NextResponse("Erreur interne", { status: 500 })
  }
}
