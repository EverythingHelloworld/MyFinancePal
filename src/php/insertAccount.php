<?php
{
    $accountType = $_GET["accountType"];
    $tempIBAN = $_GET["tempIBAN"];
    $bic = $_GET["bic"];
    $id = $_GET["id"];
    $openDate = $_GET["openDate"];

    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"myfinancepal");
    $result = mysqli_query($connection,"INSERT INTO account (AccountType, IBAN, BIC, CustomerID, OpeningDate, CurrentBalance, OpeningBalance)
    VALUES ('$accountType', '$tempIBAN', '$bic', '$id', '$openDate', 0, 0);");

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