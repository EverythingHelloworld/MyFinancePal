DROP DATABASE IF EXISTS `MyFinancePal`;

CREATE DATABASE IF NOT EXISTS `MyFinancePal`;

USE `MyFinancePal`;

CREATE TABLE Customer
(
    `CustomerID` int(10) NOT NULL AUTO_INCREMENT, 
    `Name` varchar(50) NOT NULL,
    `DOB` DATE NOT NULL, 
    `City` varchar(50) NOT NULL,
    `Street` varchar(50) NOT NULL,
    `County` varchar(50) NOT NULL,
    `Country` varchar(50) NOT NULL,
    `PostCode` varchar(50) NOT NULL, 
    `PhoneNumber` varchar(20) NOT NULL,
    PRIMARY KEY (`CustomerID`)
);

CREATE TABLE Account 
(
    `AccountID` int(10) NOT NULL AUTO_INCREMENT,
    `AccountType` varchar(20) NOT NULL,
    `IBAN` varchar(50) NOT NULL,
    `BIC` varchar(20) NOT NULL,
    `CustomerID` int(20) NOT NULL,
    `OpeningDate` DATE NOT NULL,
    `CurrentBalance` decimal(20,2) NOT NULL,
    `OpeningBalance` decimal(20,2) NOT NULL,
    `Locked` boolean NOT NULL,
    PRIMARY KEY(`AccountID`),
    CONSTRAINT customer_id_constraint
    FOREIGN KEY (CustomerID)
    REFERENCES Customer(CustomerID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE CustomerDetails 
(
    `CustomerID` int(20) NOT NULL,
    `Password` VARCHAR(20) NOT NULL,
    PRIMARY KEY(`CustomerID`),
    CONSTRAINT customer_Details_id_constraint
    FOREIGN KEY (CustomerID)
    REFERENCES Customer(CustomerID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE AdminDetails 
(
    `AdminID` int(20) NOT NULL,
    `Password` VARCHAR(20) NOT NULL,
    PRIMARY KEY(`AdminID`)
);


CREATE TABLE Transaction 
(
    `TransactionID` int(10) NOT NULL AUTO_INCREMENT, 
    `TransDate` DATETIME NOT NULL,
    `Type` varchar(50) NOT NULL, 
    `Description` varchar(100) NOT NULL,
    `Amount` decimal(20,2) NOT NULL,
    `Category` varchar(50) NOT NULL,
    `AccountID` int(10) NOT NULL, 
    PRIMARY KEY (`TransactionID`),
    CONSTRAINT trans_account_id_constraint
    FOREIGN KEY (AccountID)
    REFERENCES Account(AccountID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Payee
(
    `PayeeID` int(10) NOT NULL AUTO_INCREMENT,
    `IBAN` varchar(50) NOT NULL,
    `BIC` varchar(20) NOT NULL,
    `Name` varchar(100) NOT NULL,
    `AccountID` int(10) NOT NULL,
    PRIMARY KEY (`PayeeID`),
    CONSTRAINT payee_account_id_constraint
    FOREIGN KEY (AccountID)
    REFERENCES Account(AccountID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Loan
(
    `LoanID` int(10) NOT NULL AUTO_INCREMENT,
    `Amount` decimal(20,2) NOT NULL,
    `AccountID` int(10) NOT NULL,
    PRIMARY KEY (`LoanID`),
    CONSTRAINT loan_account_id_constraint
    FOREIGN KEY (AccountID)
    REFERENCES Account(AccountID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

ALTER TABLE Account AUTO_INCREMENT=100000;







-- db test lines - NOTE: Boolean values inserted as true or false appear as 
-- either 1 or 0 in the database. They can be inserted as true or false or 
-- as numbers, 0 is false, all other values are true
-- the following query formats can be used: 
-- select * from Account where locked = trues
-- select * from Account where locked IS TRUE/IS FALSE/IS NOT TRUE
-- select * from Account where locked = 0/1

INSERT INTO Customer (Name, DOB, City, Street, County, Country, PostCode, PhoneNumber)
VALUES ('Aaryn MacCullagh', '1993/10/10', 'Letterkenny', '123 Street', 'Donegal', 'Ireland', '0000', '0861111111');

INSERT INTO Account (AccountType, IBAN, BIC, CustomerID, OpeningDate, CurrentBalance, OpeningBalance, Locked)
VALUES ('Student', '123', '123', '1', '2000-01-01', '1000.00', '100.00', false);

INSERT INTO CustomerDetails (CustomerID, Password)
VALUES ('1', 'password');

INSERT INTO AdminDetails (AdminID, Password)
VALUES ('1234', 'admin');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-01-01 10:30:19', 'Credit', 'Lodgement', '50.00', 'Income', '100000');