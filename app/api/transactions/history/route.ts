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
    const type = searchParams.get("type")
    const collectriceId = searchParams.get("collectriceId")

    const transactions = await prisma.transaction.findMany({
      where: {
        collectrice: {
          organisationId: (session.user as any).organisationId
        },
        type: type ? (type as any) : undefined,
        collectriceId: collectriceId || undefined,
      },
      include: {
        client: {
          select: { nom: true, prenom: true, numeroCarte: true }
        },
        collectrice: {
          select: { nom: true, prenom: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 100 // On limite aux 100 dernières pour la performance
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("[TRANSACTIONS_HISTORY_GET]", error)
    return new NextResponse("Erreur interne", { status: 500 })
  }
}
