<?php
{
    $name = $_GET["name"];
    $dob = $_GET["dob"];
    $street = $_GET["street"];
    $city = $_GET["city"];
    $county = $_GET["county"];
    $country = $_GET["country"];
    $postcode = $_GET["postcode"];
    $phoneNo = $_GET["phoneNo"];

    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"myfinancepal");
    $result = mysqli_query($connection,"INSERT INTO Customer (Name, DOB, City, Street, PostCode)
    VALUES ('$name', '$dob', '$city', '$street', '$postcode');");

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