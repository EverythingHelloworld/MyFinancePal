<?php
    $customer_id = $_GET['customerID'];
    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"MyFinancePal");

    $result = mysqli_query($connection, "select * from Request where AccountActive=true");
    
    $rs = array();
    $i=0;
    while($rs[] = mysqli_fetch_assoc($result)) {
    // do nothing ;-)
    }
    mysqli_close($connection);

    unset($rs[count($rs)-1]);  //removes a null value
    print("{ \"Requests\":" . json_encode($rs) . "}");
?>