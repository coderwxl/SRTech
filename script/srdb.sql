CREATE DATABASE IF NOT EXISTS srdb;

USE srdb;

CREATE TABLE IF NOT EXISTS `user` 
(
    `id`        INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `username`  VARCHAR(32)     NOT NULL UNIQUE,
    `password`  VARCHAR(256)    NOT NULL,
    `role`      VARCHAR(32)     NOT NULL DEFAULT 'normal',

    `avatar`    VARCHAR(256)    NULL,
    `signature` VARCHAR(256)    NULL,
    `birth_date`DATE            NULL,
    `job`       VARCHAR(32)     NULL,
    `address`   VARCHAR(256)    NULL,
    `phone`     VARCHAR(16)     NULL,
    `email`     varchar(32)     NULL,
    PRIMARY KEY (`id`)
) AUTO_INCREMENT=10000 ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `friend`
(
    `user_id`   INT UNSIGNED    NOT NULL,
    `friend_id` INT UNSIGNED    NOT NULL,
    `add_time`  DATETIME        NOT NULL DEFAULT NOW(),
    `status_id` INT UNSIGNED    NOT NULL DEFAULT 0,
    `remark`    VARCHAR(32),
    `is_blacklist` TINYINT(1)   DEFAULT 0,
    `source_id` INT UNSIGNED    COMMENT '来源（预留）'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#朋友状态（用于添加朋友）
CREATE TABLE IF NOT EXISTS `status`
(
    `id`        INT UNSIGNED    NOT NULL,
    `description`   VARCHAR(64) NOT NULL UNIQUE,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#朋友来源表（预留）
CREATE TABLE IF NOT EXISTS `source`
(
    `id`        INT UNSIGNED    NOT NULL,
    `description`   VARCHAR(64) NOT NULL UNIQUE,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `group`
(
    `id`        INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `name`      VARCHAR(32)     NOT NULL,
    `create_time`   DATETIME    NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `group_detail`
(
    `group_id`  INT UNSIGNED    NOT NULL,
    `user_id`   INT UNSIGNED    NOT NULL,
    `nickname`  VARCHAR(32)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_chat`;
CREATE TABLE IF NOT EXISTS `user_chat`
(
    `user_id`   INT UNSIGNED    NOT NULL,
    `chat_id`   INT UNSIGNED    NOT NULL,
    `is_visible`TINYINT(1)      DEFAULT 1,
    `type`      TINYINT(1)      NOT NULL DEFAULT 1 COMMENT '1:用户 2:群',
    `friend_id` INT UNSIGNED,
    `group_id`  INT UNSIGNED,
    `time`      DATETIME(3)        NOT NULL DEFAULT NOW(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `chat`;
CREATE TABLE IF NOT EXISTS `chat`
(
    `id`        INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `message`;
CREATE TABLE IF NOT EXISTS `message`
(
    `id`        BIGINT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `chat_id`   INT UNSIGNED    NOT NULL,
    `user_id`   INT UNSIGNED    NOT NULL,
    `data`      TEXT            NOT NULL,
    `time`      DATETIME(3)        NOT NULL DEFAULT NOW(3),
    `is_undo`   TINYINT(1)      DEFAULT 0,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#用户删除的聊天记录
DROP TABLE IF EXISTS `user_del_message`;
CREATE TABLE IF NOT EXISTS `user_del_message`
(
    `user_id`   INT UNSIGNED    NOT NULL,
    `message_id`BIGINT UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;





#####################
# Define foreign keys
#####################
ALTER TABLE `friend` ADD CONSTRAINT `fk_friend_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `friend` ADD CONSTRAINT `fk_friend_friend_id` FOREIGN KEY (`friend_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `friend` ADD CONSTRAINT `fk_friend_source_id` FOREIGN KEY (`source_id`) REFERENCES `source` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `group_detail` ADD CONSTRAINT `fk_group_detail_group_id` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `group_detail` ADD CONSTRAINT `fk_group_detail_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user_chat` ADD CONSTRAINT `fk_user_chat_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `user_chat` ADD CONSTRAINT `fk_user_chat_chat_id` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `chat` ADD CONSTRAINT `fk_chat_group_id` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `message` ADD CONSTRAINT `fk_message_chat_id` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `message` ADD CONSTRAINT `fk_message_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user_del_message` ADD CONSTRAINT `fk_user_del_message_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `user_del_message` ADD CONSTRAINT `fk_user_del_message_message_id` FOREIGN KEY (`message_id`) REFERENCES `message` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;


#####################
# Define triggers
#####################
DROP TRIGGER IF EXISTS message_trigger;
delimiter //
CREATE TRIGGER message_trigger AFTER INSERT ON message 
FOR EACH ROW
BEGIN
    UPDATE `user_chat` SET `time` = NOW(3) WHERE `chat_id` = NEW.chat_id;
END;//
delimiter ;