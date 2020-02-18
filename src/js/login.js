$("document").ready(function(){
    insertRandomField();
    handleLogin();
})

function insertRandomField(){
    var randomNumber = Math.round(Math.random());
    //console.log(randomNumber);

    if(randomNumber == 0){
        //Insert DOB field
        $("#signInDiv").before(`<div class="form-group row">
        <label for="inputDOBLabel" class="col-sm-5 col-form-label">Date of Birth:   </label>
        <div class="col-sm-7">
            <input type="text" class="form-control" id="inputDOB" placeholder="Date of Birth">
        </div>
    </div>`);

    }else{
        //Insert Phone Num field
        $("#signInDiv").before(`<div class="form-group row">
        <label for="inputPhoneLabel" class="col-sm-5 col-form-label">Phone Number:   </label>
        <div class="col-sm-7">
            <input type="text" class="form-control" id="inputPhone" placeholder="Phone No.">
        </div>
    </div>`)
    }

}

function handleLogin(){
    $("#btnLogin").click(function (){
        this.disabled=true;
        var customerID = $('#inputID').val();
        console.log(customerID);
        var dobVisible;
        var correctLoginDetails = false;
        if($('#inputDOB').length){
            var dob = $('#inputDOB').val();
            dobVisible = true;
        }else{
            var phoneNum = $('#inputPhone').val();
            dobVisible = false;
        }  
        getCustomerDetails(customerID);

    })  

    getCustomerDetails = (customer_id) => {
        $.getJSON(`php/getLoginDetails.php?customer_id=${customer_id}`, (data) => {
          console.log(data);
        });
      }
}//close handleLogin