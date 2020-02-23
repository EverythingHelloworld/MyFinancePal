<?php
{
    $customer_id = $_GET["customer_id"];
    
    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"myfinancepal");
    $result = mysqli_query($connection,"SELECT a.accountID, accountType, IBAN, BIC, OpeningDate, CurrentBalance, OpeningBalance, c.CustomerID, Name, DOB, City, Street, County, Country, PostCode, PhoneNumber, TransactionID, TransDate, Type, Description, Amount, Category FROM account a, transaction t, Customer c where a.AccountID = t.AccountID and a.CustomerID = c.CustomerID and c.CustomerID = $customer_id ORDER BY a.AccountID, TransDate" );

    $rs = array();
    $i=0;
    while($rs[] = mysqli_fetch_assoc($result)) {
    // do nothing ;-)
    }
    mysqli_close($connection);

    unset($rs[count($rs)-1]);  //removes a null value
    print("{ \"accountTransactions\":" . json_encode($rs) . "}");
}
?>
