<?php
    $customer_id = $_POST['customerID'];
    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"MyFinancePal");

    $result = mysqli_query($connection,"DELETE FROM request WHERE CustomerID=$customer_id");
   
    mysqli_close($connection);
?>