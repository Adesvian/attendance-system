-- CreateTable
CREATE TABLE `parent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parent_name` VARCHAR(100) NOT NULL,
    `phone_number` VARCHAR(20) NOT NULL,
    `address` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE InnoDB;

-- AddForeignKey
ALTER TABLE `Siswa` ADD CONSTRAINT `Siswa_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `parent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
