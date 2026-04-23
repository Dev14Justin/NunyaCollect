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
        ...(query ? {
          OR: [
            { nom: { contains: query, mode: "insensitive" } },
            { prenom: { contains: query, mode: "insensitive" } },
            { numeroCarte: { contains: query, mode: "insensitive" } },
            { telephone: { contains: query, mode: "insensitive" } },
          ]
        } : {})
      },
      orderBy: {
        nom: "asc"
      },
      take: 10
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error("[CLIENTS_GET]", error)
    return new NextResponse("Erreur interne", { status: 500 })
  }
}
