/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Set` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_ownerId_fkey";

-- AlterTable
ALTER TABLE "Set" DROP COLUMN "ownerId",
ADD COLUMN     "creatorId" TEXT;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
