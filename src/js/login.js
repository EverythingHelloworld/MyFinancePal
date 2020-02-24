var dobVisible;
var dob;
var phoneNum;
$("document").ready(function () {
    insertRandomField();
    handleLogin();
})

function insertRandomField() {
    var randomNumber = Math.round(Math.random());

    //If random number is equal to 0 show dob field, else show phone num field
    if (randomNumber == 0) {
        //Insert DOB field
        $("#signInDiv").before(`<div class="form-group row">
            <label for="inputDOBLabel" class="col-sm-4 col-form-label">D.O.B:   </label>
            <div class="col-sm-8">
            <input type="date" id="inputDOB" max="2004-12-31" min="1899-01-01" class="form-control"></input>
            </div>
        </div>`);
    } else {
        //Insert Phone Num field
        $("#signInDiv").before(`<div class="form-group row">
            <label for="inputPhoneLabel" class="col-sm-4 col-form-label">Phone Number:   </label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="inputPhone" placeholder="Phone No.">
            </div>
        </div>`)
    }
}

//On click handler for login button
function handleLogin() {
    $("#btnLogin").click(function () {
        //Set customer id to customer ID from input field
        var customerID = $('#inputID').val();
        //Check if dob field exists
        var dobDivExists = $('#inputDOB').length;
        if (dobDivExists) {
            //set dob to dob from input field
            dob = $('#inputDOB').val();
            //This boolean is used so that we know which value to match from the db
            dobVisible = true;
        } else {
            //set dob to dob from input field
            phoneNum = $('#inputPhone').val();
            dobVisible = false;
        }
        /*If any of the fields are empty, do not do the db call and show error message,
        else getCustomerDetails from db*/
        if ((dob === '' || phoneNum === '') || customerID === '') {
            $('#signInDiv').before('<div id=errorMessage></div>');
            $('#errorMessage').attr('class', 'alert alert-danger text-center');
            $('#errorMessage').attr('role', 'alert');
            $('#errorMessage').text('All fields are required!');
        } else {
            getCustomerDetails(customerID);
        }
    })

    //Retrieves customer details from db and checks if the values entered are valid
    function getCustomerDetails(id) {
        var correctLoginDetails = false;
        //Gets customer details from db
        $.getJSON(`../php/getAllCustomerLoginDetails.php?customerID=${id}`, function (data) {
            var customer = data.CustomerDetails[0];
            var errorMessage;
            /*If data is returned, check if it matches db values, 
            else show error message*/
            if (data.CustomerDetails.length > 0) {
                //Check if dob/phone num entered matches db value
                if (dobVisible) {
                    if (dob === customer.DOB) {
                        correctLoginDetails = true;
                    } else {
                        //Display incorrect DOB error message
                        errorMessage = 'Incorrect date of birth';
                        incrementLoginAttempts();
                    }
                } else {
                    if (phoneNum === customer.PhoneNumber) {
                        correctLoginDetails = true;
                    } else {
                        //Display incorrect phone number error message
                        errorMessage = 'Incorrect phone number';
                        incrementLoginAttempts();
                    }
                }
            } else {
                errorMessage = 'You are not a registered customer';
            }

            /*If the customer correctly entered their details, set the customer id
            cookie and take them to the loginPIN page. Cookie expires in 15 minutes.*/
            if (correctLoginDetails) {
                var inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
                Cookies.set('customerID', id, {
                    expires: inFifteenMinutes
                });
                window.location.href = "loginPIN.html";
            } else {
                //Add error message to div
                $('#signInDiv').before('<div id=errorMessage></div>');
                $('#errorMessage').attr('class', 'alert alert-danger text-center');
                $('#errorMessage').attr('role', 'alert');
                $('#errorMessage').text(errorMessage);
            }
        })
    }
}//close handleLogin

function incrementLoginAttempts() {

}