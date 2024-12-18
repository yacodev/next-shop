/*
  Warnings:

  - You are about to drop the column `itemsInOder` on the `Order` table. All the data in the column will be lost.
  - Added the required column `itemsInOrder` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "itemsInOder",
ADD COLUMN     "itemsInOrder" INTEGER NOT NULL;
