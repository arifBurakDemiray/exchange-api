/*
  Warnings:

  - You are about to drop the column `cost` on the `asset` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `asset_cost_key` ON `asset`;

-- AlterTable
ALTER TABLE `asset` DROP COLUMN `cost`;
