/*
  Warnings:

  - You are about to drop the column `likes` on the `Posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "likes";

-- CreateTable
CREATE TABLE "LikedPostsOnUsers" (
    "userId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "LikedPostsOnUsers_pkey" PRIMARY KEY ("userId","postId")
);

-- AddForeignKey
ALTER TABLE "LikedPostsOnUsers" ADD CONSTRAINT "LikedPostsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedPostsOnUsers" ADD CONSTRAINT "LikedPostsOnUsers_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
