CREATE DATABASE IF NOT EXISTS srdb;

use srdb;

CREATE TABLE IF NOT EXISTS user 
(
    id int unsigned NOT NULL AUTO_INCREMENT,
    username varchar(256) NOT NULL UNIQUE,
    password varchar(256) NOT NULL,
    role varchar(32) NOT NULL DEFAULT 'normal',
    avatar varchar(256) NULL,
    signature varchar(1024) NULL,
    INDEX user_name_index (username(32)),
    PRIMARY KEY (id)
) AUTO_INCREMENT=10000 ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
