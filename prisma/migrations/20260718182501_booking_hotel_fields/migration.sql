/*
  Warnings:

  - Added the required column `hotelLocation` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hotelName` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "hotelLocation" TEXT NOT NULL,
ADD COLUMN     "hotelName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;
