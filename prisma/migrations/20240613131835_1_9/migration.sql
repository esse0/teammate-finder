/*
  Warnings:

  - A unique constraint covering the columns `[steamId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_steamId_key" ON "User"("steamId");
