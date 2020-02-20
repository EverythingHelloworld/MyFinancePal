window.onload = function() 
{
    $("#btnRegister").click(function() 
    {
        //Get all text field entries
        var name = $("#inputName").val();
        var dob = $("#inputDate").val();
        var street = $("#inputStreet").val();
        var townCity = $("#inputTwnCty").val();
        var county = $("#inputCounty").val();
        var postcode = $("#inputPostcode").val();
        var phoneNo = $("#inputPhoneNo").val();

        //Validate entries



        //Generate 6 digit password - needs to go to customerdetails table and the rest to customer table
        var password = Math.floor(100000 + Math.random() * 900000);



        $.getJSON(`../php/registerCustomer.php?name=${name}&dob=${dob}&street=${street}&townCity=${townCity}&county=${county}&postcode=${postcode}&phoneNo=${phoneNo}&password=${password}`, function(data)
        { 
        });

    });
}