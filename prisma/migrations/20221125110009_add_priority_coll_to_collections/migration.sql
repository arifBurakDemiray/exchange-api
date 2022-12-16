/*
  Warnings:

  - A unique constraint covering the columns `[priority]` on the table `collection` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `priority` to the `collection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `collection` ADD COLUMN `priority` DOUBLE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `collection_priority_key` ON `collection`(`priority`);
