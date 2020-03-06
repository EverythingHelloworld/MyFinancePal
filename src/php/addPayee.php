<?php

    $IBAN = $_POST['IBAN'];
    $BIC = $_POST['BIC'];
    $PayeeName = $_POST['PayeeName'];
    $customerID = $_POST['customerID'];
    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"MyFinancePal");

    $result = mysqli_query($connection, "INSERT INTO `Payee`(`IBAN`, `BIC`, `Name`, `CustomerID`) VALUES ('$IBAN', '$BIC', '$PayeeName','$customerID')");
    mysqli_close($connection);

?>

