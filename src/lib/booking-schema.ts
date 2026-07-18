import { z } from "zod";

// Available consultation time slots (24h keys; labels are localized in the UI).
export const BOOKING_SLOTS = ["10:00", "12:00", "14:00", "16:00"] as const;
export type BookingSlot = (typeof BOOKING_SLOTS)[number];

export const bookingSchema = z.object({
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
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  // ISO date (YYYY-MM-DD) + one of the allowed slots.
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slot: z.enum(BOOKING_SLOTS),
});

export type BookingInput = z.infer<typeof bookingSchema>;
