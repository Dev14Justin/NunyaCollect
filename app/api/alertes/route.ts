import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Non autorisé", { status: 401 })
    }

    const alertes = await prisma.alerte.findMany({
      where: {
        collectrice: {
          organisationId: (session.user as any).organisationId
        }
      },
      include: {
        collectrice: {
          select: { nom: true, prenom: true }
        },
        transaction: true
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(alertes)
  } catch (error) {
    return new NextResponse("Erreur interne", { status: 500 })
  }
}
