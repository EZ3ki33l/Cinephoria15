import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  
  await pusherServer.trigger(
    `showtime-${body.showtimeId}`,
    'seat-selected',
    { seats: body.seats }
  );

  return NextResponse.json({ success: true });
} 