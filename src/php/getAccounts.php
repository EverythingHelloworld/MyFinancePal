<?php
{
    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"myfinancepal");
    $result = mysqli_query($connection,"SELECT distinct account.CustomerID AS ID, Locked, Name FROM account, customerdetails, customer WHERE account.CustomerID = customerdetails.CustomerID AND account.CustomerID = customer.CustomerID");

    $rs = array();
    $i=0;
    while($rs[] = mysqli_fetch_assoc($result)) {
    // do nothing ;-)
    }
    mysqli_close($connection);

    unset($rs[count($rs)-1]);  //removes a null value
    print("{ \"account\":" . json_encode($rs) . "}");
}
?>
