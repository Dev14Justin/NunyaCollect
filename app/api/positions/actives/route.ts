import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Non autorisé", { status: 401 })
    }

    // Récupérer toutes les collectrices de l'organisation
    const collectrices = await prisma.utilisateur.findMany({
      where: {
        organisationId: (session.user as any).organisationId,
        role: "COLLECTRICE",
        statut: "ACTIVE"
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        // On prend la dernière position
        positions: {
          orderBy: { timestamp: "desc" },
          take: 1
        },
        // On prend la dernière transaction du jour pour afficher sur la carte
        transactions: {
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { montant: true }
        }
      }
    })

    // Transformer les données pour le format attendu par la carte
    const result = collectrices
      .filter(c => c.positions.length > 0)
      .map(c => ({
        id: c.id,
        nom: c.nom,
        prenom: c.prenom,
        latitude: c.positions[0].latitude,
        longitude: c.positions[0].longitude,
        derniereTransaction: c.transactions[0]?.montant ? Number(c.transactions[0].montant) : undefined
      }))

    return NextResponse.json(result)
  } catch (error) {
    console.error("[POSITIONS_ACTIVES_GET]", error)
    return new NextResponse("Erreur interne", { status: 500 })
  }
}
