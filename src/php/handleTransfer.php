<?php
{
    $date = $_GET["date"];
    $from_account = $_GET["from_account"];
    $to_account = $_GET["to_account"];
    $amount = $_GET["amount"];

    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"myfinancepal");

    $result = mysqli_query($connection,"INSERT INTO `transaction`(`TransDate`, `Type`, `Description`, `Amount`, `Category`, `AccountID`) VALUES ('$date','Credit','Transfer In', $amount ,'Transfers', $to_account)");


    $result2 = mysqli_query($connection,"INSERT INTO `transaction`(`TransDate`, `Type`, `Description`, `Amount`, `Category`, `AccountID`) VALUES ('$date','Debit','Transfer Out', $amount,'Transfers','$from_account')");

    $result3 = mysqli_query($connection,"UPDATE account SET CurrentBalance=CurrentBalance+$amount WHERE AccountID='$to_account'");

    $result4 = mysqli_query($connection,"UPDATE account SET CurrentBalance=CurrentBalance-$amount WHERE AccountID='$from_account'");


    mysqli_close($connection);
}
?>