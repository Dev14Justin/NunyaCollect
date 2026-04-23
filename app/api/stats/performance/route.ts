import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Non autorisé", { status: 401 })
    }

    const today = new Date()
    const start = new Date(today.setHours(0, 0, 0, 0))

    // Agréger les montants par collectrice
    const stats = await prisma.utilisateur.findMany({
      where: {
        organisationId: (session.user as any).organisationId,
        role: "COLLECTRICE"
      },
      select: {
        prenom: true,
        nom: true,
        transactions: {
          where: {
            createdAt: { gte: start }
          },
          select: { montant: true }
        }
      }
    })

    const data = stats.map(c => ({
      name: `${c.prenom} ${c.nom[0]}.`,
      total: c.transactions.reduce((sum, t) => sum + Number(t.montant), 0)
    }))
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[STATS_PERFORMANCE_GET]", error)
    return new NextResponse("Erreur interne", { status: 500 })
  }
}
