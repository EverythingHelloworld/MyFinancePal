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
        var prefix = $("#inputPrefix").val();
        var fullNumber = prefix+phoneNo;
        var sameNumber = false;

        console.log(fullNumber);

        //Check if mobile number is already registered
        $.getJSON(`../php/getCustomerPhoneNum.php`, function(data)
        { 
            for(var i=0;i<data.customer.length;i++)
		    {
                if(data.customer[i].PhoneNumber == fullNumber)
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

            else if(!phoneNoPatt.test(fullNumber))
            {

            }

            else
            {
                //Generate 6 digit password
                var password = Math.floor(100000 + Math.random() * 900000);
            
                //Insert details into customer table
                $.getJSON(`../php/registerCustomer.php?name=${name}&dob=${dob}&street=${street}&townCity=${townCity}&county=${county}&postcode=${postcode}&phoneNo=${fullNumber}&password=${password}`, function(data)
                { 
                    
                });

                //Retrieve Customer ID & Display modal with account details
                $.getJSON(`../php/getCustomerID.php?phoneNo=${fullNumber}`, function(data)
                { 

                    for(var i=0;i<data.customer.length;i++)
                    {
                        var id = data.customer[i].CustomerID;          
                    }     
                    
                    //Insert password into customerdetails table
                    $.getJSON(`../php/insertPassId.php?password=${password}&id=${id}`, function(data)
                    { 
                    });

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
//Date can go beyond 2004 when typed into.
//Add error handling to only allow 6 digits in 2nd number field.
//Error messages for each field.