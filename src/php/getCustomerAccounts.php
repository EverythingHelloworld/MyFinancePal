<?php
    $customer_id = $_GET["customerID"];
    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"MyFinancePal");

    $result = mysqli_query($connection, "SELECT AccountID, AccountType, IBAN, BIC, OpeningDate, CurrentBalance, OpeningBalance from account WHERE CustomerID=$customer_id");
    
    $rs = array();
    $i=0;
    while($rs[] = mysqli_fetch_assoc($result)) {
    // do nothing ;-)
    }
    mysqli_close($connection);

    unset($rs[count($rs)-1]);  //removes a null value
    print("{ \"CustomerAccounts\":" . json_encode($rs) . "}");
?>