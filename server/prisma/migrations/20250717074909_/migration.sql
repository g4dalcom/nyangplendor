/*
  Warnings:

  - You are about to drop the `TestUser2` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TestUser2";

-- CreateTable
CREATE TABLE "TestUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TestUser_email_key" ON "TestUser"("email");
