import { NextResponse } from "next/server";
import { prisma } from "@/db/db";

export async function GET() {
  try {
    const discounts = await prisma.discount.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        amount: true,
        isActive: true,
        isRecurrent: true,
        startDate: true,
        endDate: true,
      },
    });

    return NextResponse.json(discounts);
  } catch (error) {
    console.error("Erreur lors de la récupération des promotions:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des promotions" },
      { status: 500 }
    );
  }
} 