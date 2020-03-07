var digitsArray;
var pinCorrect = true;
var dbPassword;
var customerID;
var customer;

$("document").ready(function () {
    getCustomerIDCookie();
    handleContinueClick();
})

//Check if customer has completed first login step
function getCustomerIDCookie() {
    customerID = Cookies.get('customerID');
    //If the customer id is set, get their password from db
    if (customerID != undefined) {
        getCustomerPassword(customerID);
    } else {
        //Redirect to login page if customer id not set  
        window.location.href = "login.html";
    }
}

function getCustomerPassword(id) {
    //Get customer password from db
    $.getJSON(`../php/getCustomerDetails.php?customerID=${id}`, function (data) {
        var errorMessage;
        var passwordDigits;
    
        //If data is returned from the database, match pin digits against db password
        if (data.CustomerDetails.length > 0) {
            customer = data.CustomerDetails[0];
            dbPassword = customer.Password;

            //Function to get a set of random digits to check from the password in db
            passwordDigits = getPasswordDigits(dbPassword);

            //Copying to array so they can be sorted
            digitsArray = Array.from(passwordDigits);
            
            //Sort array
            digitsArray.sort(function (a, b) {
                return a - b;
            });

            //Insert form fields, all are initially disabled with a * placeholder
            $('#pinHeader').after('<br><div class="form-row"><div class="col">' +
                '<label for="1stPasswordDigitFieldLabel">1st</label><input type="password" class="form-control" ' +
                'id="passwordDigitField0" placeholder="*" disabled></div><div class="col"><label ' +
                'for="2ndPasswordDigitFieldLabel">2nd</label><input type="password" class="form-control" ' +
                'id="passwordDigitField1" placeholder="*" disabled></div><div class="col"><label ' +
                'for="3rdPasswordDigitFieldLabel">3rd</label><input type="password" class="form-control" ' +
                'id="passwordDigitField2" placeholder="*" disabled></div><div class="col"><label ' +
                'for="4thPasswordDigitFieldLabel">4th</label><input type="password" class="form-control" ' +
                'id="passwordDigitField3" placeholder="*" disabled></div><div class="col"><label ' +
                'for="5thPasswordDigitFieldLabel">5th</label><input type="password" class="form-control" ' +
                'id="passwordDigitField4" placeholder="*" disabled></div><div class="col"><label ' +
                'for="6thPasswordDigitFieldLabel">6th</label><input type="password" class="form-control" ' +
                'id="passwordDigitField5" placeholder="*" disabled></div></div><br>');

            //For each random digit we are going to check
            for (var i = 0; i < digitsArray.length; i++) {
                //Set placeholders to empty and enable inputs for digits we want to check
                $('#passwordDigitField' + digitsArray[i]).attr('placeholder', '');
                $('#passwordDigitField' + digitsArray[i]).removeAttr('disabled');
                //Add pattern matching to input, only allow one number
                $('#passwordDigitField' + digitsArray[i]).attr('oninput', 'this.value = this.value.replace(/[^0-9]/g, \'\'\).replace(/(\..*)\./g, \'\$1\'\);');
            }
        } else {
            /*Adds error message alert if the password can't be retrieved from the db*/
            errorMessage = 'Error getting customer details from database.';
            $('#continueBtnDiv').before('<div id=errorMessage></div>');
            $('#errorMessage').attr('class', 'alert alert-danger text-center');
            $('#errorMessage').attr('role', 'alert');
            $('#errorMessage').text(errorMessage);
        }
    })
}

function handleContinueClick() {
    $('#continueBtn').click(() => {
        $.getJSON(`../php/getCustomerDetails.php?customerID=${customerID}`, function (data) {
            customer = data.CustomerDetails[0];
            var locked = customer.Locked;
            var loginAttempts = customer.LoginAttempts;

            //If account is not locked, check digits
            if(locked === '0'){
                pinCorrect = true;
                //Check if digit entered matches the selected digit in the database
                for(var i = 0; i < digitsArray.length; i++){
                    if($('#passwordDigitField' + digitsArray[i]).val() === dbPassword.charAt([digitsArray[i]])){
                        //no need to set pinCorrect to true as it is defined above
                    }else{
                        pinCorrect = false;
                        //Add error message here
                        errorMessage = 'Incorrect digits.';
                        $('#continueBtnDiv').before('<div id=errorMessage></div>');
                        $('#errorMessage').attr('class', 'alert alert-danger text-center');
                        $('#errorMessage').attr('role', 'alert');
                        $('#errorMessage').text(errorMessage + ' Your account will be locked after 3 incorrect attempts.');
                    }
                }
                if(pinCorrect){
                    //Customer has logged in successfully, reset login attempts to 0
                    resetLoginAttempts(customerID);
                    //Set logged in cookie
                    var inThirtyMinutes = new Date(new Date().getTime() + 30 * 60 * 1000);
                    Cookies.set('loggedIn', 'true', {
                        expires: inThirtyMinutes
                    });
                    //redirect to main page
                    window.location.href = "main.html";
                }else{
                    //Customer has failed to log in, increment login attempts
                    incrementLoginAttempts(customerID);
                    /*Value of login attempts in db is one more than value of login attempts variable 
                    we set with data obtained from our db call as we have just incremented it 
                    in the db. There is no need to do an additional db call here. If login attempts 
                    is greater than or equal to 2 (3+ in db) lock their account.*/
                    if(loginAttempts >= 2)
                        lockAccount(customerID);
                }    
            }else{
                //If account is locked, display error message
                $('#continueBtnDiv').before('<div id=errorMessage></div>');
                $('#errorMessage').attr('class', 'alert alert-danger text-center');
                $('#errorMessage').attr('role', 'alert');
                $('#errorMessage').text('Your account is locked. Please contact a member of staff in branch or over the phone.');
            } 
        });       
    });
}

//This function returns a set of random digits we will ask the user to input
function getPasswordDigits(password) {
    var passwordLength = password.length;
    var numberOfRandomDigitsNeeded = 3;
    //Using a set because sets cannot contain duplicates
    var digitsToCheck = new Set();
    var randomNum;
    //While the set does not contain enough random digits (3)
    while (digitsToCheck.size < numberOfRandomDigitsNeeded) {
        //Generate random digit number between 0 (1st digit) and password length-1 (last digit)
        randomNum = getRandomNumber(0, passwordLength - 1);
        //Check if the random digit number is already in the set, add if it isn't
        if (!digitsToCheck.has(randomNum))
            digitsToCheck.add(randomNum);
    }
    return digitsToCheck;
}
