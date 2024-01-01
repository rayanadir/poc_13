-- SQL SCRIPT FOR MYSQL DATABASE

CREATE DATABASE project_13;

USE project_13;

CREATE TABLE `AGENCIES`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(40) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `createdat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedat` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `USERS`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `firstname` VARCHAR(40) NOT NULL,
    `lastname` VARCHAR(40) NOT NULL,
    `email` VARCHAR(40) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `birthdate` TIMESTAMP NOT NULL,
    `type` VARCHAR(40) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `CUSTOMERS`(
    `customerid` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `address` VARCHAR(255) NOT NULL,
    `userid` INT NOT NULL,
    FOREIGN KEY (`userid`) REFERENCES `USERS`(`id`)
);

CREATE TABLE `CUSTOMER_SERVICE`(
    `customerserviceid` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `agencyid` INT NOT NULL,
    `userid` INT NOT NULL,
    FOREIGN KEY (`userid`) REFERENCES `USERS`(`id`),
    FOREIGN KEY (`agencyid`) REFERENCES `AGENCIES`(`id`)
);

CREATE TABLE `VEHICLE_CATEGORIES`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(40) NOT NULL
);

CREATE TABLE `OFFERS`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `agencyid` INT NOT NULL,
    `departurecity` VARCHAR(255) NOT NULL,
    `backcity` VARCHAR(255) NOT NULL,
    `departuretimestamp` TIMESTAMP NOT NULL,
    `backtimestamp` TIMESTAMP NOT NULL,
    `vehiclecategory` INT NOT NULL,
    `price` INT NOT NULL,
    `createdat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedat` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (`agencyid`) REFERENCES `AGENCIES`(`id`),
    FOREIGN KEY (`vehiclecategory`) REFERENCES `VEHICLE_CATEGORIES`(`id`)
);

CREATE TABLE `RENTALS`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `offerid` INT NOT NULL,
    `customerrenterid` INT NOT NULL,
    `createdat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedat` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (`offerid`) REFERENCES `OFFERS`(`id`),
    FOREIGN KEY (`customerrenterid`) REFERENCES `CUSTOMERS`(`customerid`)
);

CREATE TABLE `MESSAGES`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `customerid` INT NOT NULL,
    `message` VARCHAR(2000) NOT NULL,
    `createdat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedat` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (`customerid`) REFERENCES `CUSTOMERS`(`customerid`)
);

CREATE TABLE `ANSWERS`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `messageid` INT NOT NULL,
    `userid` INT NOT NULL,
    `message` VARCHAR(2000) NOT NULL,
    `createdat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedat` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (`messageid`) REFERENCES `MESSAGES`(`id`),
    FOREIGN KEY (`userid`) REFERENCES `USERS`(`id`)
);

CREATE TABLE `CONVERSATIONS`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `customerid` INT NOT NULL,
    `customerserviceid` INT NOT NULL, 
    `createdat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedat` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (`customerid`) REFERENCES `CUSTOMERS`(`customerid`),
    FOREIGN KEY (`customerserviceid`) REFERENCES `CUSTOMER_SERVICE`(`customerserviceid`)
);

CREATE TABLE `CHAT`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `conversationid` INT NOT NULL,
    `messagesenderid` INT NOT NULL,
    `message` VARCHAR(2000) NOT NULL,
    `createdat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedat` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (`conversationid`) REFERENCES `CONVERSATIONS`(`id`),
    FOREIGN KEY (`messagesenderid`) REFERENCES `USERS`(`id`)
);

INSERT INTO AGENCIES(name,address)
VALUES('agency', 'address');

INSERT INTO USERS(firstname, lastname, email, password, birthdate, type)
VALUES("firstname1", "lastname1", "email1@mail.com", "password1", "2023-12-22", "customer"),
	  ("firstname2", "lastname2", "email2@mail.com", "password2", "2023-12-22", "customer_service");
      ("firstname3", "lastname3", "email3@mail.com", "password3", "2023-12-22", "customer"),
      ("firstname4", "lastname4", "email4@mail.com", "password4", "2023-12-22", "customer"),
      ("firstname5", "lastname5", "email5@mail.com", "password5", "2023-12-22", "customer_service"),
      ("firstname6", "lastname6", "email6@mail.com", "password6", "2023-12-22", "customer_service"),
      ("firstname7", "lastname7", "email7@mail.com", "password7", "2023-12-22", "customer_service");

INSERT INTO CUSTOMERS(address, userid) 
VALUES('address',1),
      ('address',3),
      ('address',4);


INSERT INTO CUSTOMER_SERVICE(agencyid, userid)
VALUES(1,2),
      (1,5),
      (1,6),
      (1,7);
