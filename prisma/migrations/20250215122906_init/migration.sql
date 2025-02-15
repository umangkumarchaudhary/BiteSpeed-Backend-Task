/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `contact` MODIFY `linkPrecedence` VARCHAR(191) NOT NULL DEFAULT 'primary';

-- CreateIndex
CREATE UNIQUE INDEX `Contact_phoneNumber_key` ON `Contact`(`phoneNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `Contact_email_key` ON `Contact`(`email`);
