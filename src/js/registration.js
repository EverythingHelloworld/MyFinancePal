window.onload = function() 
{
    $("#btnRegister").click(function() 
    {
        $("a#inputName.form-control").append(' is-valid');
            

        //check if mobile number is already registered

        //Get all text field entries
        var name = $("#inputName").val();
        var dob = $("#inputDate").val();
        var street = $("#inputStreet").val();
        var townCity = $("#inputTwnCty").val();
        var county = $("#inputCounty").val();
        var postcode = $("#inputPostcode").val();
        var phoneNo = $("#inputPhoneNo").val();

        //RegEx patterns for inputs
        var datePatt = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
        var stTwnPostPatt = new RegExp("[a-zA-Z0-9, ]");
        var phoneNoPatt = new RegExp("[0-9]");

        if(!datePatt.test(dob))
        {

        }
        else if(name == "")
        {
            
        }
        else if(!stTwnPostPatt.test(street))
        {

        }
        else if(!stTwnPostPatt.test(townCity))
        {

        }
        else if(!stTwnPostPatt.test(postcode))
        {

        }
        else if(!phoneNoPatt.test(phoneNo))
        {

        }
        else
        {

        //Generate 6 digit password
            var password = Math.floor(100000 + Math.random() * 900000);
        
        //Insert details into customer table
            $.getJSON(`../php/registerCustomer.php?name=${name}&dob=${dob}&street=${street}&townCity=${townCity}&county=${county}&postcode=${postcode}&phoneNo=${phoneNo}&password=${password}`, function(data)
            { 
            });

            $("#displayPass").empty();
            $("#displayPass").append("<b>Login Password: </b>"+password);
            $("#regModal").modal();
        }

        
    });
}


//Notes:

//Datepicker allowing 6 digits when typed in. 
//Dropdown for phone number prefix
//6 digit password needs to go to customerdetails table and the rest to customer table