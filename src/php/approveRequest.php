<?php
    $customerID = $_POST['customerID'];
    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"MyFinancePal");

    $result = mysqli_query($connection, "DELETE from customer where CustomerID=$customerID");
    
    mysqli_close($connection);
?>