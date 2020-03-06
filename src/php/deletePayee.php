<?php
    $connection = mysqli_connect("localhost","root","");
    mysqli_select_db($connection,"MyFinancePal");

    $result = mysqli_query($connection, "DELETE from payee WHERE payeeID=" . $_POST['payeeID']);
    
    mysqli_close($connection);
?>