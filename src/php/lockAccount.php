<?php
    $customer_id = $_GET['customerID'];
    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"MyFinancePal");

    $result = mysqli_query($connection, "UPDATE customerdetails SET locked=true where CustomerID=" . $_POST['id']);
   
    mysqli_close($connection);
?>