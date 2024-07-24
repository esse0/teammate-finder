-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bio" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "patronymic" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" "Status" NOT NULL DEFAULT 'OFFLINE',
    "hashedRefreshToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "chatroom_id" INTEGER NOT NULL,
    "sender_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chatroom" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Chatroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatroomsOnUsers" (
    "chatroom_Id" INTEGER NOT NULL,
    "user_Id" TEXT NOT NULL,

    CONSTRAINT "ChatroomsOnUsers_pkey" PRIMARY KEY ("chatroom_Id","user_Id")
);

-- CreateTable
CREATE TABLE "Games" (
    "id" SERIAL NOT NULL,
    "image_uri" TEXT,
    "name" TEXT NOT NULL,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamesOnUsers" (
    "userId" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "timeInGame" INTEGER NOT NULL,

    CONSTRAINT "GamesOnUsers_pkey" PRIMARY KEY ("userId","gameId")
);

-- CreateTable
CREATE TABLE "_UserFollows" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFollows_AB_unique" ON "_UserFollows"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFollows_B_index" ON "_UserFollows"("B");

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") REFERENCES "Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatroomsOnUsers" ADD CONSTRAINT "ChatroomsOnUsers_chatroom_Id_fkey" FOREIGN KEY ("chatroom_Id") REFERENCES "Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatroomsOnUsers" ADD CONSTRAINT "ChatroomsOnUsers_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamesOnUsers" ADD CONSTRAINT "GamesOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamesOnUsers" ADD CONSTRAINT "GamesOnUsers_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollows" ADD CONSTRAINT "_UserFollows_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollows" ADD CONSTRAINT "_UserFollows_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
