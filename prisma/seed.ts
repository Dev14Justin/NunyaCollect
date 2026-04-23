import { PrismaClient, Role, StatutCollectrice } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("Admin123!", 12)

  // 1. Créer une organisation
  const org = await prisma.organisation.upsert({
    where: { code: "NUNYA001" },
    update: {},
    create: {
      nom: "Nunya MicroFinance",
      code: "NUNYA001",
      email: "contact@nunyacollect.com",
    },
  })

  // 2. Créer un Super Admin
  await prisma.utilisateur.upsert({
    where: { email: "admin@nunyacollect.com" },
    update: {},
    create: {
      nom: "Admin",
      prenom: "Nunya",
      email: "admin@nunyacollect.com",
      motDePasse: password,
      role: Role.SUPER_ADMIN,
      organisationId: org.id,
    },
  })

  // 3. Créer une Collectrice de test
  await prisma.utilisateur.upsert({
    where: { email: "collectrice1@test.com" },
    update: {},
    create: {
      nom: "Koumé",
      prenom: "Ami",
      email: "collectrice1@test.com",
      motDePasse: password,
      role: Role.COLLECTRICE,
      statut: StatutCollectrice.ACTIVE,
      organisationId: org.id,
    },
  })

  console.log("Base de données peuplée avec succès ! 🌱")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
