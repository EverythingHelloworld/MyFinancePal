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
        var sameNumber = false;

        //Check if mobile number is already registered
        $.getJSON(`../php/getCustomerPhoneNum.php`, function(data)
        { 
            for(var i=0;i<data.customer.length;i++)
		    {
                if(data.customer[i].PhoneNumber == phoneNo)
                {
                    sameNumber = true;
                }                  
            }
            
            //RegEx patterns for inputs
            var datePatt = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
            var stTwnPostPatt = new RegExp("^[a-zA-Z0-9 ]+$");
            var phoneNoPatt = new RegExp("^[0-9]+$");
            var namePatt = new RegExp("^[a-zA-Z ]+$");

            //If mobile number is registered display modal 
            if(sameNumber)
            {
                $("#numberModal").modal();
            }
            //Check each fields pattern
            else if(!datePatt.test(dob) )
            {

            }

            else if(name == "" || (!namePatt.test(name)))
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

                //Retrieve Customer ID & Display modal with account details
                $.getJSON(`../php/getCustomerID.php?phoneNo=${phoneNo}`, function(data)
                { 

                    for(var i=0;i<data.customer.length;i++)
                    {
                        var id = data.customer[i].CustomerID;          
                    }       

                    //Show modal and display password + CustomerID
                    $("#displayPass").empty();
                    $("#displayPass").append("<b>Customer ID: </b>"+id+"<br>");
                    $("#displayPass").append("<b>Login Password: </b>"+password);
                    $("#regModal").modal();

                });
            }
        });  
    });

    $("#btnCancel").click(function() 
    {
        window.location.href = 'login.html'
    });

    //Reload page after modal closes
    $('#regModal').on('hidden.bs.modal', function () 
    {
        location.reload();
    })
}


//Notes:

//Dropdown for phone number prefix??
//6 digit password needs to go to customerdetails table and the rest to customer table