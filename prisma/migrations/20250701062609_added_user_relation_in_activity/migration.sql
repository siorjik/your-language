/*
  Warnings:

  - Added the required column `userId` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Made the column `activityTypeId` on table `Activity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `setId` on table `Activity` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "activityTypeId" SET NOT NULL,
ALTER COLUMN "setId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
