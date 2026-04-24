import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Non autorisé", { status: 401 })
    }

    // Récupérer les transactions de la collectrice connectée uniquement
    const transactions = await prisma.transaction.findMany({
      where: {
        collectriceId: (session.user as any).id
      },
      include: {
        client: {
          select: { nom: true, prenom: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 20 // Les 20 dernières suffisent pour l'affichage mobile rapide
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("[COLLECTRICE_TRANSACTIONS_GET]", error)
    return new NextResponse("Erreur interne", { status: 500 })
  }
}
