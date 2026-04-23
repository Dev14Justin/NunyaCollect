import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { startOfDay, endOfDay, eachHourOfInterval, format } from "date-fns"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Non autorisé", { status: 401 })
    }

    const today = new Date()
    const start = startOfDay(today)
    const end = endOfDay(today)

    // Récupérer toutes les transactions du jour
    const transactions = await prisma.transaction.findMany({
      where: {
        collectrice: {
          organisationId: (session.user as any).organisationId
        },
        createdAt: {
          gte: start,
          lte: end
        }
      },
      select: {
        montant: true,
        createdAt: true
      }
    })

    // Initialiser les heures de la journée
    const hours = eachHourOfInterval({ start, end })
    const data = hours.map(hour => {
      const hourStr = format(hour, "HH'h'")
      const total = transactions
        .filter(t => {
          const tHour = new Date(t.createdAt).getHours()
          return tHour === hour.getHours()
        })
        .reduce((sum, t) => sum + Number(t.montant), 0)

      return {
        heure: hourStr,
        montant: total
      }
    })

    // On ne garde que les heures jusqu'à maintenant pour le graphique
    const currentHour = new Date().getHours()
    return NextResponse.json(data.slice(0, currentHour + 2))
  } catch (error) {
    console.error("[STATS_COLLECTIONS_GET]", error)
    return new NextResponse("Erreur interne", { status: 500 })
  }
}
