/*
  Warnings:

  - The primary key for the `LikedPostsOnUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `LikedPostsOnUsers` table. All the data in the column will be lost.
  - Added the required column `userLogin` to the `LikedPostsOnUsers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LikedPostsOnUsers" DROP CONSTRAINT "LikedPostsOnUsers_userId_fkey";

-- AlterTable
ALTER TABLE "LikedPostsOnUsers" DROP CONSTRAINT "LikedPostsOnUsers_pkey",
DROP COLUMN "userId",
ADD COLUMN     "userLogin" TEXT NOT NULL,
ADD CONSTRAINT "LikedPostsOnUsers_pkey" PRIMARY KEY ("userLogin", "postId");

-- AddForeignKey
ALTER TABLE "LikedPostsOnUsers" ADD CONSTRAINT "LikedPostsOnUsers_userLogin_fkey" FOREIGN KEY ("userLogin") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;
