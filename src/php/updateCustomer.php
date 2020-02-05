<?php
{
    $id = $_GET["id"];
    $name = $_GET["name"];
    $dob = $_GET["dob"];
    $street = $_GET["street"];
    $city = $_GET["city"];
    $postcode = $_GET["postcode"];

    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"myfinancepal");
    $result = mysqli_query($connection,"UPDATE Customer SET Name = '$name', DOB = '$dob', City = '$city', Street = '$street', PostCode = '$postcode' WHERE CustomerID = '$id'");

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
