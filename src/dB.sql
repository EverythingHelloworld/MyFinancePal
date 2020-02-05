DROP DATABASE IF EXISTS `MyFinancePal`;

CREATE DATABASE IF NOT EXISTS `MyFinancePal`;

USE `MyFinancePal`;

CREATE TABLE Customer
(
    `CustomerID` int(20) NOT NULL, 
    `Name` varchar(50) NOT NULL,
    `D.O.B` DATE NOT NULL, 
    `City` varchar(50) NOT NULL,
    `Street` varchar(50) NOT NULL,
    `PostCode` varchar(50) NOT NULL, 
    PRIMARY KEY (`CustomerID`)
);

CREATE TABLE Account 
(
    `AccountID` int(20) NOT NULL AUTO_INCREMENT,
    `IBAN` varchar(50) NOT NULL,
    `BIC` varchar(20) NOT NULL,
    `CustomerID` int(20) NOT NULL,
    `OpeningDate` DATE NOT NULL,
    `CurrentBalance` decimal(50,2) NOT NULL,
    `OpeningBalance` decimal(50,2) NOT NULL,
    PRIMARY KEY(`AccountID`),
    CONSTRAINT customer_id_constraint
    FOREIGN KEY (CustomerID)
    REFERENCES Customer(CustomerID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Transaction 
(
    `TransactionID` int(20) NOT NULL, 
    `TransDate` DATE NOT NULL,
    `Type` varchar(50) NOT NULL, 
    `Desc` varchar(100) NOT NULL,
    `Amount` decimal(50,2) NOT NULL,
    `Category` varchar(50) NOT NULL,
    `AccountID` int(20) NOT NULL, 
    PRIMARY KEY (`TransactionID`),
    CONSTRAINT trans_account_id_constraint
    FOREIGN KEY (AccountID)
    REFERENCES Account(AccountID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Payee
(
    `PayeeID` int(20) NOT NULL,
    `IBAN` varchar(50) NOT NULL,
    `BIC` varchar(20) NOT NULL,
    `Name` varchar(100) NOT NULL,
    `AccountID` int(20) NOT NULL,
    PRIMARY KEY (`PayeeID`),
    CONSTRAINT payee_account_id_constraint
    FOREIGN KEY (AccountID)
    REFERENCES Account(AccountID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Loan
(
    `LoanID` int(20) NOT NULL,
    `Amount` decimal(50,2) NOT NULL,
    `AccountID` int(20) NOT NULL,
    PRIMARY KEY (`LoanID`),
    CONSTRAINT loan_account_id_constraint
    FOREIGN KEY (AccountID)
    REFERENCES Account(AccountID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

