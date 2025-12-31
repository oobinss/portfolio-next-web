-- AlterTable
ALTER TABLE "public"."board" ADD COLUMN     "author_name" VARCHAR(100),
ADD COLUMN     "password_hash" VARCHAR(255);
