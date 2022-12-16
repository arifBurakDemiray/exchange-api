/*
  Warnings:

  - You are about to drop the `user_codes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_codes` DROP FOREIGN KEY `user_codes_user_id_fkey`;

-- DropTable
DROP TABLE `user_codes`;

-- CreateTable
CREATE TABLE `portfolio` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` VARCHAR(191) NOT NULL,
    `share_id` VARCHAR(191) NOT NULL,
    `rate` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_code` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asset` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `share_id` VARCHAR(191) NOT NULL,
    `rate` INTEGER NOT NULL,
    `cost` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('BUY', 'SELL') NOT NULL,

    UNIQUE INDEX `asset_cost_key`(`cost`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `portfolio` ADD CONSTRAINT `portfolio_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `portfolio` ADD CONSTRAINT `portfolio_share_id_fkey` FOREIGN KEY (`share_id`) REFERENCES `share`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_code` ADD CONSTRAINT `user_code_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset` ADD CONSTRAINT `asset_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset` ADD CONSTRAINT `asset_share_id_fkey` FOREIGN KEY (`share_id`) REFERENCES `share`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
