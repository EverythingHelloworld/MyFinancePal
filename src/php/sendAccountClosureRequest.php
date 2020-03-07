<?php
    $customer_id = $_POST['customerID'];
    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"MyFinancePal");

    $result = mysqli_query($connection, "IF [NOT] EXISTS ( SELECT * FROM Request WHERE customerID=$customer_id) BEGIN INSERT INTO request (AccountActive, CustomerID) VALUES(true, $customer_id) END");
   
    mysqli_close($connection);
?>