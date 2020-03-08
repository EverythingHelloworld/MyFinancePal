<?php
    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"MyFinancePal");

    $result = mysqli_query($connection, "select requestID, r.CustomerID, Name from request r, customer c where AccountActive=true and r.CustomerID = c.CustomerID");
    
    $rs = array();
    $i=0;
    while($rs[] = mysqli_fetch_assoc($result)) {
    // do nothing ;-)
    }
    mysqli_close($connection);

    unset($rs[count($rs)-1]);  //removes a null value
    print("{ \"Requests\":" . json_encode($rs) . "}");
?>