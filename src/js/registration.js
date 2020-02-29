window.onload = function() 
{
    $.ajaxSetup({
        async: false
    });

    $("#btnRegister").click(function() 
    {
        //Get all text field entries
        var name = $("#inputName").val();
        var email = $("#inputEmail").val();
        var dob = $("#inputDate").val();
        var street = $("#inputStreet").val();
        var townCity = $("#inputTwnCty").val();
        var county = $("#inputCounty").val();
        var postcode = $("#inputPostcode").val();
        var phoneNo = $("#inputPhoneNo").val();
        var prefix = $("#inputPrefix").val();
        var fullNumber = prefix+phoneNo;
        var sameEmail = false;
        var year = dob.substring(0,4);
        var accountId;
        var iBan;

        //Check if mobile number is already registered
        $.getJSON(`../php/getCustomerEmail.php`, function(data)
        {    
            for(var i=0;i<data.customer.length;i++)
		    {
                if(data.customer[i].Email === email)
                {
                    sameEmail = true;
                }                  
            }
            
            //RegEx patterns for inputs
            var datePatt = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
            var stTwnPostPatt = new RegExp("^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$");
            var phoneNoPatt = new RegExp("^[0-9_]+( [0-9_]+)*$");
            var namePatt = new RegExp("^[a-zA-Z_]+( [a-zA-Z_]+)*$");
            var emailPatt = new RegExp("^[^@]+@[^@]+\.[^@]+$");

            //If mobile number is registered display modal 
            if(sameEmail)
            {
                $("#emailModal").modal();
            }

            //Check each fields pattern

            else if(!namePatt.test(name) || name === '')
            {
                $('#registerDiv').before('<div id=errorMessage></div>');
                $('#errorMessage').attr('class', 'alert alert-danger text-center');
                $('#errorMessage').attr('role', 'alert');
                $('#errorMessage').text("Please enter a valid name.");
            }

            else if(!emailPatt.test(email) || email === '')
            {
                $('#registerDiv').before('<div id=errorMessage></div>');
                $('#errorMessage').attr('class', 'alert alert-danger text-center');
                $('#errorMessage').attr('role', 'alert');
                $('#errorMessage').text("Please enter a valid e-mail. (Must contain @ and .)");
            }

            else if(!datePatt.test(dob) || year > 2004 || year < 1899)
            {

            }

            else if(!stTwnPostPatt.test(street) || street === '')
            {
                $('#registerDiv').before('<div id=errorMessage></div>');
                $('#errorMessage').attr('class', 'alert alert-danger text-center');
                $('#errorMessage').attr('role', 'alert');
                $('#errorMessage').text("Please enter a valid street name.");
            }

            else if(!stTwnPostPatt.test(townCity) || townCity === '')
            {
                $('#registerDiv').before('<div id=errorMessage></div>');
                $('#errorMessage').attr('class', 'alert alert-danger text-center');
                $('#errorMessage').attr('role', 'alert');
                $('#errorMessage').text("Please enter a valid town/city name.");
            }

            else if(!stTwnPostPatt.test(postcode) || postcode === '')
            {
                $('#registerDiv').before('<div id=errorMessage></div>');
                $('#errorMessage').attr('class', 'alert alert-danger text-center');
                $('#errorMessage').attr('role', 'alert');
                $('#errorMessage').text("Please enter a valid postcode.");
            }

            else if(!phoneNoPatt.test(fullNumber) || phoneNo === '' || !(phoneNo.length === 7))
            {
                $('#registerDiv').before('<div id=errorMessage></div>');
                $('#errorMessage').attr('class', 'alert alert-danger text-center');
                $('#errorMessage').attr('role', 'alert');
                $('#errorMessage').text("Please enter a valid phone number.");
            }

            else
            {
                //Generate 6 digit password
                var password = Math.floor(100000 + Math.random() * 900000);
            
                //Insert details into customer table
                $.getJSON(`../php/registerCustomer.php?name=${name}&dob=${dob}&street=${street}&townCity=${townCity}&county=${county}&postcode=${postcode}&phoneNo=${fullNumber}&email=${email}`, function(data)
                { 
                    
                });

                //Retrieve Customer ID & Display modal with account details
                $.getJSON(`../php/getCustomerID.php?email=${email}`, function(data)
                { 

                    for(var i=0;i<data.customer.length;i++)
                    {
                        var id = data.customer[i].CustomerID;          
                    }     
                    
                    //Insert password into customerdetails table
                    $.getJSON(`../php/insertPassId.php?password=${password}&id=${id}`, function(data)
                    { 
                    });

                        //Generate account details
                        var tempIBAN = "placeholder";
                        var accountType;
                        var bic = "BOFIIE"+ Math.floor(Math.random()*(999-100+1)+100);
                        
                        if(Math.floor(Math.random() * 2) == 0)
                        {
                            accountType = "Current";
                        }
                        else
                        accountType = "Student";

                        //inserting account details into the accounts table
                        $.getJSON(`../php/insertAccount.php?accountType=${accountType}&tempIBAN=${tempIBAN}&bic=${bic}&id=${id}&openDate=${todaysDate()}`, function(data)
                        { 
                        });

                        $.getJSON(`../php/getAccountId.php?id=${id}`, function(data)
                        { 
                            for(var i=0;i<data.customer.length;i++)
                            {
                                accountId = data.customer[i].AccountID;         
                            } 
                        });

                        iBan = "IE12BOFI"+accountId+Math.floor(100000 + Math.random() * 900000);
                        console.log(iBan);

                        $.getJSON(`../php/insertIBAN.php?iBan=${iBan}&accountId=${accountId}`, function(data)
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
        window.location.href = 'login.html'
    })
}