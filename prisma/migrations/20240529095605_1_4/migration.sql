/*
  Warnings:

  - You are about to drop the `ChatroomsOnUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatroomsOnUsers" DROP CONSTRAINT "ChatroomsOnUsers_chatroom_Id_fkey";

-- DropForeignKey
ALTER TABLE "ChatroomsOnUsers" DROP CONSTRAINT "ChatroomsOnUsers_user_Id_fkey";

-- DropTable
DROP TABLE "ChatroomsOnUsers";

-- CreateTable
CREATE TABLE "_ChatroomToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChatroomToUser_AB_unique" ON "_ChatroomToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatroomToUser_B_index" ON "_ChatroomToUser"("B");

-- AddForeignKey
ALTER TABLE "_ChatroomToUser" ADD CONSTRAINT "_ChatroomToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Chatroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatroomToUser" ADD CONSTRAINT "_ChatroomToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
