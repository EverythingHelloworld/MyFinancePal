<?php

    $id = $_GET["id"];

    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"MyFinancePal");

    $result = mysqli_query($connection, "SELECT AccountID FROM account WHERE CustomerID = $id ");
    
    $rs = array();
    $i=0;
    while($rs[] = mysqli_fetch_assoc($result)) {
    // do nothing ;-)
    }
    mysqli_close($connection);

    unset($rs[count($rs)-1]);  //removes a null value
    print("{ \"customer\":" . json_encode($rs) . "}");
?>