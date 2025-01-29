import { prisma } from "@/db/db";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload: WebhookEvent = await request.json();

  if (payload.type === "user.created") {
    const { id } =
      payload.data;
    try {
      await prisma.user.create({
        data: {
          id,
          userName: payload.data.username ?? "",
          firstName: payload.data.first_name ?? "",
          lastName: payload.data.last_name ?? "",
          image: payload.data.image_url ?? "",
          email: payload.data.email_addresses[0].email_address ?? "",
        },
      });
      return NextResponse.json({ status: "success" });
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
        { status: "error", message: "Failed to create user" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ status: "unsupported" });
  }
}
