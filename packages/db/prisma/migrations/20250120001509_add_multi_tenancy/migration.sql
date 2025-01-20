/*
  Warnings:

  - A unique constraint covering the columns `[userId,itemId]` on the table `CollectionItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdById` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `huntId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "huntId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Hunt" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Hunt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participation" (
    "huntId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Participation_pkey" PRIMARY KEY ("huntId","userId")
);

-- CreateIndex
CREATE INDEX "Hunt_createdById_idx" ON "Hunt"("createdById");

-- CreateIndex
CREATE INDEX "Participation_userId_idx" ON "Participation"("userId");

-- CreateIndex
CREATE INDEX "Participation_huntId_idx" ON "Participation"("huntId");

-- CreateIndex
CREATE INDEX "CollectionItem_userId_idx" ON "CollectionItem"("userId");

-- CreateIndex
CREATE INDEX "CollectionItem_itemId_idx" ON "CollectionItem"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionItem_userId_itemId_key" ON "CollectionItem"("userId", "itemId");

-- CreateIndex
CREATE INDEX "Item_huntId_idx" ON "Item"("huntId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_huntId_fkey" FOREIGN KEY ("huntId") REFERENCES "Hunt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hunt" ADD CONSTRAINT "Hunt_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_huntId_fkey" FOREIGN KEY ("huntId") REFERENCES "Hunt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
