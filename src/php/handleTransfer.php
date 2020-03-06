<?php
{
    $from_account_id = $_GET["account_from_ID"];
    $to_account_Id = $_GET["account_to_ID"];
    $date = $_GET["date"];
    $amount = $_GET["amount"];

    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"myfinancepal");

    $result = mysqli_query($connection,"INSERT INTO `transaction`(`TransDate`, `Type`, `Description`, `Amount`, `Category`, `AccountID`) VALUES ($date,"Credit","Transfer In",$amount,"Transfers",$to_account_Id)");


    $result2 = mysqli_query($connection,"INSERT INTO `transaction`(`TransDate`, `Type`, `Description`, `Amount`, `Category`, `AccountID`) VALUES ($date,"Credit","Transfer Out",$amount,"Transfers",$from_account_Id)");

    $result3 = mysqli_query($connection,"UPDATE account SET CurrentBalance+=$amount where AccountID="$_GET['to_account_id']);

    $result4 = mysqli_query($connection,"UPDATE account SET CurrentBalance-=$amount where AccountID="$_GET['from_account_id']);

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