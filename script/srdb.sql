CREATE DATABASE IF NOT EXISTS srdb;

USE srdb;

CREATE TABLE IF NOT EXISTS `user` 
(
    `id`        INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `username`  VARCHAR(256)    NOT NULL UNIQUE,
    `password`  VARCHAR(256)    NOT NULL,
    `role`      VARCHAR(32)     NOT NULL DEFAULT 'normal',
    `INDEX`     user_name_index (username(64)),
    PRIMARY KEY (`id`)
) AUTO_INCREMENT=10000 ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `user_detail`
(
    `user_id`   INT UNSIGNED    NOT NULL,
    `avatar`    VARCHAR(256)    NULL,
    `signature` VARCHAR(1024)   NULL,
    `birth_date`DATE            NULL,
    `job`       VARCHAR(32)     NULL,
    `address`   VARCHAR(256)    NULL,
    `phone`     VARCHAR(16)     NULL,
    `email`     varchar(32)     NULL,
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




#####################
# Define foreign keys
#####################
ALTER TABLE user_detail ADD CONSTRAINT fk_user_detail_user_id FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE;