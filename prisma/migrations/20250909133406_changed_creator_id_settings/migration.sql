UPDATE "Set"
SET "creatorId" = "userId"
WHERE "creatorId" IS NULL;
-- AlterTable
ALTER TABLE "Set" ALTER COLUMN "creatorId" SET NOT NULL;
