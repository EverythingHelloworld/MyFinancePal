var dobVisible;
var dob;
var phoneNum;
var numberPattern = new RegExp("^[0-9]*$");
$("document").ready(function(){
    insertRandomField();
    handleLogin();
    handleRegister();
})

function insertRandomField() {
    var randomNumber = Math.round(Math.random());

    //If random number is equal to 0 show dob field, else show phone num field
    if (randomNumber == 0) {
        //Insert DOB field
        $("#signInDiv").before(`<div class="form-group row">
            <label for="inputDOBLabel" class="col-sm-3 col-form-label">D.O.B:   </label>
            <div class="col-sm-5">
            <input type="date" id="inputDOB" max="2004-12-31" min="1899-01-01" class="form-control"></input>
            </div>
        </div>`);
    } else {
        //Insert Phone Num field
        $("#signInDiv").before(`<div class="form-group row">
            <label for="inputPhoneLabel" class="col-sm-3 col-form-label">Phone Number:   </label>
            <div class="col-sm-5">
                <input type="text" class="form-control" id="inputPhone" placeholder="Phone No.">
            </div>
        </div>`)
    }
}

//On click handler for login button
function handleLogin() {
    var errorMessage = '';

    //Triggered when customer clicks the sign in button, this function validates the inputs
    $("#btnLogin").click(function () {
        //Checks if the dob input exists. Length = 0 if it doesn't and 1 if it does.
        var dobDivExists = $('#inputDOB').length;
        
        //If dob exists, get the value the user entered for dob and set dobVisible to true
        if(dobDivExists){
            dob = $('#inputDOB').val();
            dobVisible = true;
        }else {
            //If dob does not exist, get the value the user entered for phone number and set dobVisible to false
            phoneNum = $('#inputPhone').val();
            dobVisible = false;
        }  

        //Get id the customer entered
        var customerID = $('#inputID').val();

        /*Only do the db call if (the dob div doesn't exist - i.e. phone num exists - and phone number is valid pattern) OR 
        dob exists - no need to check phone num pattern - AND none of the fields are empty AND the customer ID pattern is valid*/
        if( ((!dobDivExists && numberPattern.test($('#inputPhone').val())) || dobDivExists) && dob !== '' && phoneNum !== '' && customerID !== '' && numberPattern.test($('#inputID').val())) { 
                getCustomerDetails(customerID);
        } else{

            //If dob div doesn't exist (phone num exists) and phone number not valid, set error message
            if(!dobDivExists && !numberPattern.test($('#inputPhone').val())){
                errorMessage = 'Phone number field can only contain numbers.';
            }

            //if any of the fields are empty, set error message
            if((dob === '' || phoneNum === '') || customerID === ''){
                errorMessage = 'All fields required.';
            }

            //if customer id pattern is invalid, set message
            if(!numberPattern.test($('#inputID').val())){
                errorMessage = 'Customer ID field can only contain numbers.';
            }

            //Insert error message div with specified error message
            $('#signInDiv').before('<div id=errorMessage></div>');
            $('#errorMessage').attr('class', 'col-sm-8 alert alert-danger text-center');
            $('#errorMessage').attr('role', 'alert');
            $('#errorMessage').text(errorMessage);
        }
    }) //close sign in button click handler

    //Retrieves customer details from db and checks if the values match those in the database
    function getCustomerDetails(id) {
        var correctLoginDetails = false; 
        //Gets customer details from db
        $.getJSON(`../php/getAllCustomerLoginDetails.php?customerID=${id}`, function (data) {
            var customer = data.CustomerDetails[0];
            var errorMessage2;
                /*If data is returned, check if it matches db values, 
                else show error message*/
                if (data.CustomerDetails.length > 0) {
                    //If the customer's account is not locked, do further validation, else show error message
                    if(customer.Locked === '0'){
                        //Check if dob/phone num entered matches db value
                        if (dobVisible) {
                            if (dob === customer.DOB) {
                                correctLoginDetails = true;
                            } else {
                                //Display incorrect DOB error message
                                errorMessage2 = 'Incorrect date of birth.';
                            }
                        } else {
                            if (phoneNum === customer.PhoneNumber) {
                                correctLoginDetails = true;
                            } else {
                                //Display incorrect phone number error message
                                errorMessage2 = 'Incorrect phone number.';
                            }
                        }

                        /*If the customer correctly entered their details, set the customer id
                        cookie and take them to the loginPIN page. Cookie expires in 15 minutes.*/
                        if (correctLoginDetails) {
                            var inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
                            Cookies.set('customerID', id, {
                                expires: inFifteenMinutes
                            });
                            //Customer has signed in successfully so reset their login attempts
                            resetLoginAttempts(id);
                            //Go to login pin page
                            window.location.href = "loginPIN.html";
                        } else {
                            //Customer has entered incorrect login details so increment their login attempts
                            incrementLoginAttempts(id);
                            //Use the value obtained in original db call, no need for another db call.
                            var noAttempts = customer.LoginAttempts;
                            /*Login attempts in db is one more than login attempts variable we set with data obtained from 
                            our earlier db call as we have just incremented it in the db. There is no need to do an additional db 
                            call here. If number of attempts is greater than or equal to 2 (3+ in db), lock their account*/
                            if(noAttempts >= '2'){
                                lockAccount(id);
                            }
                            //Add error message to div
                            $('#signInDiv').before('<div id=errorMessage></div>');
                            $('#errorMessage').attr('class', 'col-sm-8 alert alert-danger text-center');
                            $('#errorMessage').attr('role', 'alert');
                            $('#errorMessage').text(errorMessage2 + ' Your account will be locked after 3 incorrect attempts.');
                        }
                    }else{
                        //Add error message to div
                        $('#signInDiv').before('<div id=errorMessage></div>');
                        $('#errorMessage').attr('class', 'col-sm-8 alert alert-danger text-center');
                        $('#errorMessage').attr('role', 'alert');
                        $('#errorMessage').text('Your account is locked. Please contact a member of staff in branch or over the phone.');
                    }
                } else {
                    //If customer id is not in the database set the error message
                    errorMessage2 = 'You are not a registered customer.';
                    $('#signInDiv').before('<div id=errorMessage></div>');
                        $('#errorMessage').attr('class', 'col-sm-8 alert alert-danger text-center');
                        $('#errorMessage').attr('role', 'alert');
                        $('#errorMessage').text(errorMessage2);
                }
        }) //close getCustomerDetails db call
    } //close getCustomerDetails
} //close handleLogin

//If the customer clicks the register button, go to register page
function handleRegister() {
    $("#btnRegister").click(function () {
        window.location.href = 'registration.html';
    })
}