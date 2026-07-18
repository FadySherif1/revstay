import { z } from "zod";
import { PLATFORMS } from "@/lib/platforms";

// Available consultation time slots (24h keys; labels are localized in the UI).
export const BOOKING_SLOTS = ["10:00", "12:00", "14:00", "16:00"] as const;
export type BookingSlot = (typeof BOOKING_SLOTS)[number];

const PLATFORM_SET = new Set<string>(PLATFORMS);

export const bookingSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    // Loose phone check: 6-20 chars, digits with optional +, spaces, dashes.
    phone: z
      .string()
      .trim()
      .min(6)
      .max(20)
      .regex(/^[+()\-\s0-9]+$/),
    email: z.string().trim().email(),
    hotelName: z.string().trim().min(2).max(120),
    hotelLocation: z.string().trim().min(2).max(120),
    roomCount: z.coerce.number().int().min(1).max(100000),
    hasListings: z.boolean(),
    // Chosen from the known 7 platforms (validated below); empty when
    // hasListings is false.
    platforms: z.array(z.string()).default([]),
    otherPlatform: z.string().trim().max(120).optional().or(z.literal("")),
    notes: z.string().trim().max(1000).optional().or(z.literal("")),
    // ISO date (YYYY-MM-DD) + one of the allowed slots.
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    slot: z.enum(BOOKING_SLOTS),
  })
  .superRefine((data, ctx) => {
    if (data.hasListings) {
      const known = data.platforms.filter((p) => PLATFORM_SET.has(p));
      const hasOther = Boolean(data.otherPlatform && data.otherPlatform.trim());
      // With listings, require at least one known platform or an "other".
      if (known.length === 0 && !hasOther) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["platforms"],
          message: "At least one platform is required.",
        });
      }
      // Reject any platform value not in the known set.
      if (data.platforms.some((p) => !PLATFORM_SET.has(p))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["platforms"],
          message: "Invalid platform.",
        });
      }
    }
  });

export type BookingInput = z.infer<typeof bookingSchema>;
