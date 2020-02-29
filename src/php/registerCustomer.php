<?php

    $name = $_GET["name"];
    $email = $_GET["email"];
    $dob = $_GET["dob"];
    $townCity = $_GET["townCity"];
    $street = $_GET["street"];
    $county = $_GET["county"];
    $postcode = $_GET["postcode"];
    $phoneNo = $_GET["phoneNo"];

    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"myfinancepal");
    $result = mysqli_query($connection,"INSERT INTO Customer (Name, DOB, City, Street, County, PostCode, PhoneNumber, Email)
    VALUES ('$name', '$dob', '$townCity', '$street', '$county', '$postcode', '$phoneNo', '$email');");

    mysqli_close($connection);
?>