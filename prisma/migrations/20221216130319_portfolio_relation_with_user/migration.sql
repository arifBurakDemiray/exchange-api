/*
  Warnings:

  - A unique constraint covering the columns `[money]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `share` table without a default value. This is not possible if the table is not empty.
  - Added the required column `money` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `share` ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `money` DOUBLE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_money_key` ON `user`(`money`);

-- AddForeignKey
ALTER TABLE `share` ADD CONSTRAINT `share_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
