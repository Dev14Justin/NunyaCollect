import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== "COLLECTRICE") {
      return new NextResponse("Non autorisé", { status: 401 })
    }

    const body = await req.json()
    const { latitude, longitude, precision, vitesse } = body

    if (latitude === undefined || longitude === undefined) {
      return new NextResponse("Coordonnées manquantes", { status: 400 })
    }

    // Enregistrer la position dans l'historique
    const position = await prisma.positionGPS.create({
      data: {
        collectriceId: (session.user as any).id,
        latitude,
        longitude,
        precision,
        vitesse,
      }
    })

    return NextResponse.json(position)
  } catch (error) {
    console.error("[POSITIONS_POST]", error)
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

    if (!collectriceId) {
      return new NextResponse("ID collectrice requis", { status: 400 })
    }

    const positions = await prisma.positionGPS.findMany({
      where: {
        collectriceId,
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      orderBy: {
        timestamp: "asc"
      }
    })

    return NextResponse.json(positions)
  } catch (error) {
    console.error("[POSITIONS_GET]", error)
    return new NextResponse("Erreur interne", { status: 500 })
  }
}
