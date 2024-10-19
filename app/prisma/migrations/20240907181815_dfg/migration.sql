/*
  Warnings:

  - Added the required column `operation` to the `LogBook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LogBook" ADD COLUMN     "is_flight_mode_automatic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_flight_mode_manuel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "operation" TEXT NOT NULL;
