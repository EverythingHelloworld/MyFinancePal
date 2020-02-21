var dobVisible;
var dob;
var phoneNum;
var correctLoginDetails = false;
$("document").ready(function () {
    insertRandomField();
    handleLogin();
})

function insertRandomField() {
    var randomNumber = Math.round(Math.random());
    //console.log(randomNumber);

    if (randomNumber == 0) {
        //Insert DOB field
        $("#signInDiv").before(`<div class="form-group row">
        <label for="inputDOBLabel" class="col-sm-5 col-form-label">Date of Birth:   </label>
        <div class="col-sm-7">
            <input type="text" class="form-control" id="inputDOB" placeholder="Date of Birth">
        </div>
    </div>`);

    } else {
        //Insert Phone Num field
        $("#signInDiv").before(`<div class="form-group row">
        <label for="inputPhoneLabel" class="col-sm-5 col-form-label">Phone Number:   </label>
        <div class="col-sm-7">
            <input type="text" class="form-control" id="inputPhone" placeholder="Phone No.">
        </div>
    </div>`)
    }

}

function handleLogin() {
    $("#btnLogin").click(function () {
        this.disabled = true;
        var customerID = $('#inputID').val();
        var dobDivExists = $('#inputDOB').length;
        if (dobDivExists) {
            dob = $('#inputDOB').val();
            dobVisible = true;
        } else {
            phoneNum = $('#inputPhone').val();
            dobVisible = false;
        }
        getCustomerDetails(customerID);
    })

    function getCustomerDetails(id) {
        $.getJSON(`../php/getLoginDetails.php?customerID=${id}`, function (data) {
            console.log(data);
            var customer = data.CustomerDetails[0];
            if (dobVisible) {
                if (dob === customer.DOB)
                    correctLoginDetails = true;
            } else {
                if (phoneNum === customer.PhoneNumber)
                    correctLoginDetails = true;
            }
            if (correctLoginDetails) {
                document.cookie = `CustomerID=${customer.CustomerID}; path=/`;
                window.location.href = "loginPIN.html";
            } else {
                //Add error message to div
                console.log('incorrect login details');
            }
        });
    }
}//close handleLogin