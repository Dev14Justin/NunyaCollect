import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Non autorisé", { status: 401 })
    }

    const organisation = await prisma.organisation.findUnique({
      where: { id: (session.user as any).organisationId },
      include: { parametres: true }
    })

    return NextResponse.json(organisation)
  } catch (error) {
    return new NextResponse("Erreur interne", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Non autorisé", { status: 401 })
    }

    const { nom, email, telephone, adresse } = await req.json()

    const updated = await prisma.organisation.update({
      where: { id: (session.user as any).organisationId },
      data: { nom, email, telephone, adresse }
    })

    return NextResponse.json(updated)
  } catch (error) {
    return new NextResponse("Erreur lors de la mise à jour", { status: 500 })
  }
}
