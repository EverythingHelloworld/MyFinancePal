<?php
    $reqID = $_POST['requestID'];
    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"MyFinancePal");

    $result = mysqli_query($connection, "UPDATE request set AccountActive=0 where requestID=$reqID");
    mysqli_close($connection);
?>