<?php
{
    $name = $_GET["name"];
    $dob = $_GET["dob"];
    $townCity = $_GET["townCity"];
    $street = $_GET["street"];
    $county = $_GET["county"];
    $postcode = $_GET["postcode"];
    $phoneNo = $_GET["phoneNo"];
    $password = $_GET["password"];

    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"myfinancepal");
    $result = mysqli_query($connection,"INSERT INTO Customer (Name, DOB, City, Street, County, PostCode, PhoneNumber)
    VALUES ('$name', '$dob', '$townCity', '$street', '$county', '$postcode', '$phoneNo');");

    $rs = array();
    $i=0;
    while($rs[] = mysqli_fetch_assoc($result)) {
    // do nothing ;-)
    }
    mysqli_close($connection);

    unset($rs[count($rs)-1]);  //removes a null value
    print("{ \"customer\":" . json_encode($rs) . "}");
}
?>