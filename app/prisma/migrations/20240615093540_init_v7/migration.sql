/*
  Warnings:

  - A unique constraint covering the columns `[user_id,type]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Token_user_id_token_key";

-- CreateIndex
CREATE UNIQUE INDEX "Token_user_id_type_key" ON "Token"("user_id", "type");
