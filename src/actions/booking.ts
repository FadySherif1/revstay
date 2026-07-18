"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { bookingSchema } from "@/lib/booking-schema";
import { checkRateLimit } from "@/lib/rate-limit";

const BOOKING_MAX_PER_MIN = 5;

export type CreateBookingResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function createBooking(input: unknown): Promise<CreateBookingResult> {
  // Booking requires an authenticated user.
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "unauthenticated" };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = checkRateLimit(`booking:${ip}`, BOOKING_MAX_PER_MIN);
  if (!allowed) {
    return { ok: false, error: "rateLimited" };
  }

  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "invalid" };
  }

  const { name, phone, email, hotelName, hotelLocation, notes, date, slot } =
    parsed.data;

  // Combine the chosen day + slot into a timestamp.
  const scheduledAt = new Date(`${date}T${slot}:00`);
  if (Number.isNaN(scheduledAt.getTime())) {
    return { ok: false, error: "invalid" };
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        name,
        phone,
        email: email.toLowerCase(),
        hotelName,
        hotelLocation,
        notes: notes || null,
        scheduledAt,
      },
      select: { id: true },
    });
    return { ok: true, id: booking.id };
  } catch (err) {
    console.error("createBooking failed:", err);
    return { ok: false, error: "generic" };
  }
}
