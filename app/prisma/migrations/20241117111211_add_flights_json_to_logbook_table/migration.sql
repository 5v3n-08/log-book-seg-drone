/*
  Warnings:

  - You are about to drop the column `end` on the `LogBook` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `LogBook` table. All the data in the column will be lost.
  - Added the required column `flights` to the `LogBook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LogBook" DROP COLUMN "end",
DROP COLUMN "start",
ADD COLUMN     "flights" JSONB NOT NULL;
