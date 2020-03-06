<?php
    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"MyFinancePal");

    $result = mysqli_query($connection, "INSERT INTO `Payee`(`IBAN`, `BIC`, `Name`, `CustomerID`) VALUES ($_POST['IBAN'],$_POST['BIC'],$_POST['PayeeName'],$_POST['customerID'])");
    mysqli_close($connection);

?>

