DROP DATABASE IF EXISTS `MyFinancePal`;

CREATE DATABASE IF NOT EXISTS `MyFinancePal`;

USE `MyFinancePal`;

CREATE TABLE Customer
(
    `CustomerID` int(20) NOT NULL AUTO_INCREMENT, 
    `Name` varchar(50) NOT NULL,
    `DOB` DATE NOT NULL, 
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
    `TransactionID` int(20) NOT NULL AUTO_INCREMENT, 
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
    `PayeeID` int(20) NOT NULL AUTO_INCREMENT,
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
    `LoanID` int(20) NOT NULL AUTO_INCREMENT,
    `Amount` decimal(50,2) NOT NULL,
    `AccountID` int(20) NOT NULL,
    PRIMARY KEY (`LoanID`),
    CONSTRAINT loan_account_id_constraint
    FOREIGN KEY (AccountID)
    REFERENCES Account(AccountID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

ALTER TABLE Account AUTO_INCREMENT=100000;







-- db test lines

INSERT INTO Customer (Name, DOB, City, Street, PostCode)
VALUES ('Aaryn MacCullagh', '1993/10/10', 'Letterkenny', '123 Street', '0000');

INSERT INTO Account (IBAN, BIC, CustomerID, OpeningDate, CurrentBalance, OpeningBalance)
VALUES ('123', '123', '1', '2000-01-01', '100.00', '0.00' );
