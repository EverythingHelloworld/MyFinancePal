<?php
    $customer_id = $_GET['customerID'];
    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"MyFinancePal");

    $result = mysqli_query($connection, "UPDATE customerdetails SET loginAttempts=loginAttempts+1 where CustomerID=" . $_POST['id']);
   
    mysqli_close($connection);
?>