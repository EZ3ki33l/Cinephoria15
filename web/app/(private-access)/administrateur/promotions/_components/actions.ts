"use server";

import { prisma } from "@/db/db";
import { Prisma } from "@prisma/client";

export async function getAllDiscounts() {
  return prisma.discount.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}

export async function deleteDiscount(id: number) {
  const discount = await prisma.discount.delete({ where: { id } });
  if (!discount) throw new Error("Promotion introuvable");
}

interface DiscountInput {
  name: string;
  amount: number;
  startDate: string;
  endDate: string;
  isRecurrent: boolean;
  promotionType: "permanent" | "annual" | "ponctual";
  annualStartDay?: string;
  annualEndDay?: string;
}

export async function createDiscounts(discounts: DiscountInput[]) {
  try {
    const createdDiscounts = await Promise.all(
      discounts.map((discount) => {
        const data: Prisma.DiscountCreateInput = {
          name: discount.name,
          code: discount.name.toUpperCase().replace(/\s+/g, ''),
          amount: discount.amount,
          isRecurrent: discount.promotionType !== "ponctual",
          description: getDiscountDescription(discount),
          isActive: true,
        };

        if (discount.promotionType === "ponctual") {
          data.startDate = new Date(discount.startDate);
          data.endDate = new Date(discount.endDate);
        } else if (discount.promotionType === "annual") {
          // Pour les promotions annuelles, on utilise l'année en cours
          const currentYear = new Date().getFullYear();
          data.startDate = new Date(`${currentYear}-${discount.annualStartDay}T00:00:00`);
          data.endDate = new Date(`${currentYear}-${discount.annualEndDay}T23:59:59`);
        }

        return prisma.discount.create({ data });
      })
    );
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la création des promotions:", error);
    return { success: false };
  }
}

function getDiscountDescription(discount: DiscountInput): string {
  const baseDescription = `Réduction de ${discount.amount}€`;
  
  switch (discount.promotionType) {
    case "permanent":
      return `${baseDescription} (Promotion permanente)`;
    case "annual":
      return `${baseDescription} (Promotion annuelle récurrente du ${discount.annualStartDay} au ${discount.annualEndDay})`;
    default:
      return `${baseDescription} (Promotion ponctuelle)`;
  }
}
