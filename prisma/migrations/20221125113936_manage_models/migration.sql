/*
  Warnings:

  - You are about to drop the column `blocked` on the `todo` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `todo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `collection` ADD COLUMN `blocked` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deletable` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `todo` DROP COLUMN `blocked`,
    DROP COLUMN `userId`,
    ADD COLUMN `deadline` DATETIME(3) NULL,
    ADD COLUMN `done` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `notify_me` BOOLEAN NOT NULL DEFAULT true;
