/*
  Warnings:

  - Added the required column `roomCount` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "hasListings" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otherPlatform" TEXT,
ADD COLUMN     "platforms" TEXT[],
ADD COLUMN     "roomCount" INTEGER NOT NULL;
