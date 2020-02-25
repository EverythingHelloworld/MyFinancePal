var digitsArray;
var pinCorrect = true;
var dbPassword;

$("document").ready(function () {
    getCustomerIDCookie();
    handleContinueClick();
})

function getCustomerIDCookie() {
    var customerID = Cookies.get('customerID');
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
        var customer = data.CustomerDetails[0];
        dbPassword = customer.Password;
        var errorMessage;
        var passwordDigits;
        //If data is returned from the database, match pin digits against db password
        if (data.CustomerDetails.length > 0) {
            passwordDigits = getPasswordDigits(dbPassword);
            //Copying to array so they can be sorted
            digitsArray = Array.from(passwordDigits);
            digitsArray.sort(function (a, b) {
                return a - b;
            });
            //Insert form fields
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
            for (var i = 0; i < digitsArray.length; i++) {
                //Set placeholders to * and disable inputs for digits not needed
                $('#passwordDigitField' + digitsArray[i]).attr('placeholder', '');
                $('#passwordDigitField' + digitsArray[i]).removeAttr('disabled');
                $('#passwordDigitField' + digitsArray[i]).attr('oninput', 'this.value = this.value.replace(/[^0-9.]/g, \'\'\).replace(/(\..*)\./g, \'\$1\'\);');
            }
        } else {
            /*Adds error message alert if the password can't be retrieved from the db, 
            --Test this later*/
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
        pinCorrect = true;
        //Check if digit entered matches the selected digit in the database
        for(var i = 0; i < digitsArray.length; i++){
            if($('#passwordDigitField' + digitsArray[i]).val() === dbPassword.charAt([digitsArray[i]])){
            }else{
                pinCorrect = false;
                //Add error message here
                errorMessage = 'Incorrect digits';
                $('#continueBtnDiv').before('<div id=errorMessage></div>');
                $('#errorMessage').attr('class', 'alert alert-danger text-center');
                $('#errorMessage').attr('role', 'alert');
                $('#errorMessage').text(errorMessage);
            }
        }
        if(pinCorrect){
            //redirect to main page
            window.location.href = "main.html";
        }                   
    });
}

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
