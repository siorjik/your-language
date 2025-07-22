-- AlterTable
ALTER TABLE "Set" ADD COLUMN     "ownerId" TEXT;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
