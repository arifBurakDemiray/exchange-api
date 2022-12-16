-- DropIndex
DROP INDEX `user_money_key` ON `user`;

-- AlterTable
ALTER TABLE `user` MODIFY `money` DOUBLE NOT NULL DEFAULT 0.0;
