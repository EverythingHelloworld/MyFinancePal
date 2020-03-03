<?php

    $email = $_GET["email"];

    $connection2 = mysqli_connect("localhost","root","");
    mysqli_select_db($connection2,"myfinancepal");
    $result2 = mysqli_query($connection2,"SELECT `CustomerID` FROM `customer` WHERE Email = '$email'");

    $rs2 = array();
    $j=0;
    while($rs2[] = mysqli_fetch_assoc($result2)) 
    {
    // do nothing ;-)
    }
    mysqli_close($connection2);

    unset($rs2[count($rs2)-1]);  //removes a null value
    print("{ \"customer\":" . json_encode($rs2) . "}");

?>