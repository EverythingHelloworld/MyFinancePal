<?php
{
    $date = $_POST["date"];
    $from_account = $_POST["from_account"];
    $to_account = $_POST["to_account"];
    $amount = $_POST["amount"];

    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"myfinancepal");

    $result = mysqli_query($connection,"INSERT INTO `transaction`(`TransDate`, `Type`, `Description`, `Amount`, `Category`, `AccountID`) VALUES ($date,"Credit","Transfer In",$amount,"Transfers",$to_account)");


    $result2 = mysqli_query($connection,"INSERT INTO `transaction`(`TransDate`, `Type`, `Description`, `Amount`, `Category`, `AccountID`) VALUES ($date,"Debit","Transfer Out",$amount,"Transfers",$from_account)");

    $result3 = mysqli_query($connection,"UPDATE account SET CurrentBalance+=$amount WHERE AccountID=$to_account");

    $result4 = mysqli_query($connection,"UPDATE account SET CurrentBalance-=$amount WHERE AccountID=$from_account");

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