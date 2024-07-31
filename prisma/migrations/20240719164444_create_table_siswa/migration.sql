-- CreateTable
CREATE TABLE `Siswa` (
    `uid_number` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `nik` VARCHAR(100) NULL,
    `gender` VARCHAR(100) NOT NULL,
    `class` INTEGER NOT NULL,
    `parent_id` INTEGER NOT NULL,

    PRIMARY KEY (`uid_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE InnoDB;
