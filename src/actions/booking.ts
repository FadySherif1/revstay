"use server";

import { Prisma } from "@/generated/prisma/client";
import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { bookingSchema, BOOKING_SLOTS, type BookingSlot } from "@/lib/booking-schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";
import { sendBookingConfirmation } from "@/lib/send-booking-email";
import { cairoSlotToUtcDate, formatCairo, isPastCairo } from "@/lib/booking-time";

const BOOKING_MAX_PER_MIN = 5;

export type CreateBookingResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type MyBooking = {
  id: string;
  hotelName: string;
  scheduledAt: string; // ISO — formatted client-side for the active locale
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  isUpcoming: boolean;
};

// Returns the signed-in user's bookings, soonest first. Cancelled ones are
// excluded. Used by "My Bookings" and to detect an existing reservation
// before opening a fresh booking form.
export async function getMyBookings(): Promise<MyBooking[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const now = new Date();
  const rows = await prisma.booking.findMany({
    where: { userId: session.user.id, status: { not: "CANCELLED" } },
    orderBy: { scheduledAt: "asc" },
    select: { id: true, hotelName: true, scheduledAt: true, status: true },
  });

  return rows.map((b) => {
    const past = isPastCairo(b.scheduledAt, now);
    // A lapsed PENDING/CONFIRMED booking reads as COMPLETED rather than
    // staying "upcoming" forever or vanishing — this also unblocks
    // requestBooking()'s "you already have one" gate once the time passes.
    const status = past && b.status !== "CANCELLED" ? "COMPLETED" : b.status;
    return {
      id: b.id,
      hotelName: b.hotelName,
      scheduledAt: b.scheduledAt.toISOString(),
      status: status as MyBooking["status"],
      isUpcoming: !past,
    };
  });
}

/** Returns the still-open slots for a given Cairo-local date (YYYY-MM-DD). */
export async function getAvailableSlots(date: string): Promise<BookingSlot[]> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];

  const dayStart = cairoSlotToUtcDate(date, "00:00");
  const dayEnd = cairoSlotToUtcDate(date, "23:59");

  const taken = await prisma.booking.findMany({
    where: {
      status: { not: "CANCELLED" },
      scheduledAt: { gte: dayStart, lte: dayEnd },
    },
    select: { scheduledAt: true },
  });

  const takenSlotTimes = new Set(
    taken.map((b) => formatCairo(b.scheduledAt, "en", { hour: "2-digit", minute: "2-digit", hour12: false }))
  );

  return BOOKING_SLOTS.filter((s) => !takenSlotTimes.has(s));
}

export async function createBooking(input: unknown): Promise<CreateBookingResult> {
  // Booking requires an authenticated user.
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "unauthenticated" };
  }

  const ip = await getClientIp();
  const { allowed } = await checkRateLimit(`booking:${ip}`, BOOKING_MAX_PER_MIN);
  if (!allowed) {
    return { ok: false, error: "rateLimited" };
  }

  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "invalid" };
  }

  const {
    name,
    phone,
    email,
    hotelName,
    hotelLocation,
    roomCount,
    hasListings,
    platforms,
    otherPlatform,
    notes,
    date,
    slot,
  } = parsed.data;

  // Interpret the guest's date+slot pick as Cairo-local time (Revstay's
  // market is Egypt), then store the resulting UTC instant.
  const scheduledAt = cairoSlotToUtcDate(date, slot);
  if (Number.isNaN(scheduledAt.getTime())) {
    return { ok: false, error: "invalid" };
  }

  // If they don't have listings, ignore any platform selection.
  const finalPlatforms = hasListings ? platforms : [];
  const finalOther =
    hasListings && otherPlatform && otherPlatform.trim()
      ? otherPlatform.trim()
      : null;

  try {
    const booking = await prisma.$transaction(async (tx) => {
      // Re-check availability inside the transaction right before insert —
      // closes the TOCTOU gap between the client's slot-picker load and
      // submit. The partial unique index on scheduledAt (active bookings
      // only) is the hard backstop if two requests still race past this.
      const clash = await tx.booking.findFirst({
        where: { scheduledAt, status: { not: "CANCELLED" } },
        select: { id: true },
      });
      if (clash) {
        throw new SlotTakenError();
      }

      return tx.booking.create({
        data: {
          userId: session.user.id,
          name,
          phone,
          email: email.toLowerCase(),
          hotelName,
          hotelLocation,
          roomCount,
          hasListings,
          platforms: finalPlatforms,
          otherPlatform: finalOther,
          notes: notes || null,
          scheduledAt,
        },
        select: { id: true },
      });
    });

    // Best-effort confirmation email — must never block the booking.
    const locale = (await getLocale()) === "ar" ? "ar" : "en";
    const whenLabel = formatCairo(scheduledAt, locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit",
    });
    await sendBookingConfirmation({
      to: email.toLowerCase(),
      name,
      hotelName,
      whenLabel,
      locale,
    });

    return { ok: true, id: booking.id };
  } catch (err) {
    if (err instanceof SlotTakenError) {
      return { ok: false, error: "slotTaken" };
    }
    // The partial unique index raises this if a race slips past the
    // in-transaction check above.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { ok: false, error: "slotTaken" };
    }
    console.error("createBooking failed:", err);
    return { ok: false, error: "generic" };
  }
}

class SlotTakenError extends Error {}
