window.onload = function() 
{
    $("#btnRegister").click(function() 
    {
        var name = $("#inputName").val();
        var dob = $("#inputDate").val();
        var street = $("#inputStreet").val();
        var townCity = $("#inputTwnCty").val();
        var county = $("#inputCounty").val();
        var country = $("#inputCountry").val();
        var post = $("#inputPostcode").val();
        var phone = $("#inputPhoneNo").val();


        console.log(name);
        console.log(dob);
        console.log(street);
        console.log(townCity);
        console.log(county);
        console.log(country);
        console.log(post);
        console.log(phone);




        // $.getJSON(`php/registerCustomer.php`, function(data)
        // {
        // });

    });
}