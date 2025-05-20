/*
  Warnings:

  - You are about to drop the column `stock` on the `order` table. All the data in the column will be lost.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `stock`,
    ADD COLUMN `total` INTEGER NOT NULL;
