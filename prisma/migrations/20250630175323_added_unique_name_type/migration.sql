/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ActivityType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ActivityType_name_key" ON "ActivityType"("name");
