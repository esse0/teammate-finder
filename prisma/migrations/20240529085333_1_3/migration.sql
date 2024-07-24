/*
  Warnings:

  - You are about to drop the column `name` on the `Chatroom` table. All the data in the column will be lost.
  - Added the required column `flogin` to the `Chatroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slogin` to the `Chatroom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chatroom" DROP COLUMN "name",
ADD COLUMN     "flogin" TEXT NOT NULL,
ADD COLUMN     "slogin" TEXT NOT NULL;
