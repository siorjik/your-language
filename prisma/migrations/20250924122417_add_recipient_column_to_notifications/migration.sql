ALTER TABLE "Notification" ADD COLUMN "recipientId" TEXT;

UPDATE "Notification" SET "recipientId" = "userId" WHERE "recipientId" IS NULL;
