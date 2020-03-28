<?php
{
    $accountId = $_GET["accountId"];
    $amount = $_GET["amount"];
    $repayAmount = $_GET["repayAmount"];
    $purpose = $_GET["purpose"];

    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"myfinancepal");
    $result = mysqli_query($connection,"INSERT INTO loan (Amount, AccountID, Purpose, RepaymentOption)
    VALUES ('$amount', '$accountId', '$purpose', '$repayAmount');");

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