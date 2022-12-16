/*
  Warnings:

  - You are about to drop the `collection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `todo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `collection` DROP FOREIGN KEY `collection_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `todo` DROP FOREIGN KEY `todo_collection_id_fkey`;

-- DropTable
DROP TABLE `collection`;

-- DropTable
DROP TABLE `todo`;

-- CreateTable
CREATE TABLE `share` (
    `id` VARCHAR(191) NOT NULL,
    `symbol` VARCHAR(3) NOT NULL,
    `rate` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `share_symbol_key`(`symbol`),
    UNIQUE INDEX `share_price_key`(`price`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `share_id` VARCHAR(191) NOT NULL,
    `rate` INTEGER NOT NULL,
    `cost` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('BUY', 'SELL') NOT NULL,

    UNIQUE INDEX `transaction_cost_key`(`cost`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_share_id_fkey` FOREIGN KEY (`share_id`) REFERENCES `share`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
