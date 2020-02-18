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
    `LoginAttempts` int(1) NOT NULL,
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

INSERT INTO Customer (Name, DOB, City, Street, County, Country, PostCode, PhoneNumber)
VALUES ('Daisy Johnson', '1991/12/10', 'Dublin', '456 Street', 'Dublin', 'Ireland', '1111', '0862222222');

INSERT INTO Customer (Name, DOB, City, Street, County, Country, PostCode, PhoneNumber)
VALUES ('Chloe Bennett', '1994/10/05', 'Cork', '678 Street', 'Cork', 'Ireland', '2222', '0863333333');

INSERT INTO Account (AccountType, IBAN, BIC, CustomerID, OpeningDate, CurrentBalance, OpeningBalance, Locked)
VALUES ('Student', 'IE12BOFI100002423554', 'BOFIIE234', '1', '2000-01-01', '1000.00', '100.00', false);

INSERT INTO Account (AccountType, IBAN, BIC, CustomerID, OpeningDate, CurrentBalance, OpeningBalance, Locked)
VALUES ('Current', 'IE12BOFI100004646355', 'BOFIIE333', '2', '2001-11-01', '2000.00', '500.00', false);

INSERT INTO Account (AccountType, IBAN, BIC, CustomerID, OpeningDate, CurrentBalance, OpeningBalance, Locked)
VALUES ('Student', 'IE12BOFI100002563463', 'BOFIIE122', '3', '2003-05-01', '8000.00', '400.00', false);

INSERT INTO CustomerDetails (CustomerID, Password)
VALUES ('1', 'password');

INSERT INTO CustomerDetails (CustomerID, Password)
VALUES ('2', 'password2');

INSERT INTO CustomerDetails (CustomerID, Password)
VALUES ('3', 'password3');

INSERT INTO AdminDetails (AdminID, Password)
VALUES ('1234', 'admin');

-- Account 100000

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-01-01 10:30:19', 'Credit', 'Lodgement', '50.00', 'Income', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-01-03 11:40:12', 'Credit', 'Lodgement', '200.00', 'Income', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-01-03 12:30:11', 'Debit', 'Subway', '25.00', 'Restaurants', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-01-03 16:30:20', 'Debit', 'Costa', '5.00', 'Restaurants', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-01-05 09:28:15', 'Credit', 'Wages', '1500.00', 'Income', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-01-07 17:30:00', 'Credit', 'Lodgement', '100.00', 'Income', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-01-08 15:20:01', 'Debit', 'Amazon', '12.00', 'Online Shopping', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-01-10 10:10:11', 'Debit', 'Ebay', '150.00', 'Online Shopping', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-01-15 10:05:13', 'Debit', 'Tesco', '61.23', 'Groceries', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-01-25 10:07:25', 'Debit', 'Apple - Apple Music', '5.00', 'Subscription', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-01-28 10:34:27', 'Credit', 'Lodgement', '20.00', 'Income', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-02-01 14:45:32', 'Debit', 'Office Supplies Inc', '40.00', 'Miscellaneous', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-02-01 15:28:11', 'Debit', 'New York Times', '4.99', 'Subscription', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-02-01 15:39:10', 'Debit', 'Netflix', '10.00', 'Subscription', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-02-05 17:33:19', 'Debit', 'Sky TV', '45.00', 'Subscription', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-02-08 18:30:12', 'Debit', 'Homestore & More', '7.99', 'Household', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-02-12 18:01:13', 'Debit', 'Amazon', '20.00', 'Subscription', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-02-14 19:38:11', 'Debit', 'Apple - ITUNES', '10.00', 'Subscription', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-02-20 16:01:14', 'Debit', 'So Lo', '30.10', 'Groceries', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-02-27 11:36:25', 'Debit', 'Lidl', '100.25', 'Groceries', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-03-01 13:11:12', 'Debit', 'Homestore & More', '150.00', 'Household', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-03-01 13:40:19', 'Debit', 'H&M', '70.00', 'Clothing', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-03-02 14:50:10', 'Debit', 'Penneys', '140.00', 'Clothing', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-03-04 15:03:16', 'Debit', 'KFC', '30.00', 'Restaurants', '100000');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2000-03-06 12:00:10', 'Debit', 'PC World', '53.44', 'Miscellaneous', '100000');

-- Account 100001

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2001-11-11 10:30:19', 'Credit', 'Wages', '1700.00', 'Income', '100001');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2001-11-15 11:40:12', 'Debit', 'Just Eat IE', '50.00', 'Restaurants', '100001');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2001-11-20 12:30:11', 'Debit', 'Gym', '25.00', 'Miscellaneous', '100001');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2001-11-21 16:30:20', 'Debit', 'Right Price Tiles', '200.00', 'Household', '100001');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2001-12-05 09:28:15', 'Debit', 'Smyths Toys', '55.00', 'Miscellaneous', '100001');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2001-12-07 17:30:00', 'Credit', 'Lodgement', '400.00', 'Income', '100001');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2001-12-08 15:20:01', 'Debit', 'Amazon', '18.00', 'Online Shopping', '100001');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2001-12-15 10:05:13', 'Debit', 'Tesco', '23.45', 'Groceries', '100001');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2002-01-10 10:10:11', 'Debit', 'Aldi', '100.00', 'Groceries', '100001');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2002-01-25 10:07:25', 'Debit', 'Apple - Apple Music', '5.00', 'Subscription', '100001');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2002-01-28 10:34:27', 'Debit', 'Apple - ICloud', '7.99', 'Subscription', '100001');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2002-02-01 14:45:32', 'Debit', 'New Look', '100.00', 'Clothing', '100001');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2002-02-01 15:28:11', 'Debit', 'Boohoo.com', '15.99', 'Clothing', '100001');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2002-02-01 15:39:10', 'Credit', 'Lodgement', '100.00', 'Income', '100001');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2002-03-05 17:33:19', 'Debit', '123Ink IE', '45.50', 'Miscellaneous', '100001');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2002-03-08 18:30:12', 'Debit', 'Tesco', '14.07', 'Groceries', '100001');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2002-03-12 18:01:13', 'Debit', 'Amazon', '40.00', 'Online Shopping', '100001');

-- Account 100002

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-05-11 10:30:19', 'Credit', 'Wages', '10000.00', 'Income', '100002');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-05-15 11:40:12', 'Debit', 'CarpetRight', '1000.00', 'Household', '100002');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-05-20 12:30:11', 'Debit', 'Gym', '25.00', 'Miscellaneous', '100002');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-05-21 16:30:20', 'Debit', 'Amazon Prime', '12.00', 'Subscription', '100002');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-05-22 09:28:15', 'Debit', 'Letterkenny Cinema', '30.00', 'Miscellaneous', '100002');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-05-23 17:30:00', 'Debit', 'Withdrawal', '200.00', 'Miscellaneous', '100002');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-06-08 15:20:01', 'Debit', 'Amazon', '18.00', 'Online Shopping', '100002');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-06-15 10:05:13', 'Debit', 'Tesco', '51.30', 'Groceries', '100002');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-06-17 10:10:11', 'Debit', 'Aldi', '30.00', 'Groceries', '100002');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-07-05 10:07:25', 'Debit', 'Spotify', '10.00', 'Subscription', '100002');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-07-18 10:34:27', 'Debit', 'Just Eat IE', '41.70', 'Restaurants', '100002');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-07-18 14:45:32', 'Debit', 'New Look', '200.00', 'Clothing', '100002');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-07-18 15:28:11', 'Debit', 'M&S', '70.00', 'Clothing', '100002');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-07-19 15:39:10', 'Debit', 'Withdrawal', '300.00', 'Miscellaneous', '100002');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-07-22 17:33:19', 'Debit', 'Insomnia', '5.50', 'Restaurants', '100002');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-07-24 18:30:12', 'Debit', 'Oasis', '24.50', 'Groceries', '100002');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-07-24 18:01:13', 'Debit', 'Amazon', '250.00', 'Online Shopping', '100002');

INSERT INTO Transaction (TransDate, Type, Description, Amount, Category, AccountID)
VALUES ('2003-08-12 18:01:13', 'Debit', 'YESSTYLE', '132.00', 'Online Shopping', '100002');


INSERT INTO Payee (IBAN, BIC, Name, AccountID)
VALUES('IE12BOFI1245002423554','BOFIIE123', 'Jemma Simmons', 100000);
INSERT INTO Payee (IBAN, BIC, Name, AccountID)
VALUES('IE12BOFI1568336554334','BOFIIE767', 'Jeff Ward', 100001);

-- INSERT INTO Loan (Amount, AccountID)
-- VALUES('5000', 100000)