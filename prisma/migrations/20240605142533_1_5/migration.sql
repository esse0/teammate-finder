-- CreateTable
CREATE TABLE "Posts" (
    "id" SERIAL NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
