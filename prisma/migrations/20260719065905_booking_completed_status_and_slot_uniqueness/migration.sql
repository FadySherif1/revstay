-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'COMPLETED';

-- Prevent two non-cancelled bookings from ever sharing the same slot.
-- Partial index (Prisma's schema DSL can't express a WHERE clause on
-- @@unique), enforced at the DB level as a backstop behind the
-- application-level check inside createBooking()'s transaction.
CREATE UNIQUE INDEX "Booking_scheduledAt_active_key"
  ON "Booking" ("scheduledAt")
  WHERE "status" != 'CANCELLED';
