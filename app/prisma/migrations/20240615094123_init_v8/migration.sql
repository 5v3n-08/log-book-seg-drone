-- DropIndex
DROP INDEX "Token_user_id_type_key";

-- CreateIndex
CREATE INDEX "Token_user_id_type_idx" ON "Token"("user_id", "type");
