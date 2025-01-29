import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Création des réductions par défaut
  const discounts = [
    {
      name: "Moins de 12 ans",
      code: "UNDER12",
      amount: 6.00,
      description: "Réduction pour les enfants de moins de 12 ans",
    },
    {
      name: "Moins de 26 ans",
      code: "UNDER26",
      amount: 4.00,
      description: "Réduction pour les jeunes de moins de 26 ans",
    },
    {
      name: "Plus de 60 ans",
      code: "SENIOR60",
      amount: 4.00,
      description: "Réduction pour les seniors de plus de 60 ans",
    },
    {
      name: "PMR",
      code: "PMR",
      amount: 4.00,
      description: "Réduction pour les personnes à mobilité réduite",
    },
  ]

  for (const discount of discounts) {
    await prisma.discount.upsert({
      where: { code: discount.code },
      update: discount,
      create: discount,
    })
  }

  console.log('Base de données initialisée avec les réductions par défaut')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 