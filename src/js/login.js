$("document").ready(function(){
    insertRandomField();
    // handleLogin();
})

function insertRandomField(){
    var randomNumber = Math.round(Math.random());
    console.log('Random Number:', randomNumber);

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

// function handleLogin(){
//     $('#loginBtn').click(function(){
//         var username = $('#inputID').val();
//         // var password = $('#password').val();
//         $.getJSON(`php/getLoginDetails.php`, function(data) {
//             for(var i=0; i < data.users.length; i++){
//                 if(username === data.users[i].email && password === data.users[i].password){
//                     $('#loginFailed').empty();
//                     document.cookie = `username=${data.users[i].email}; path=/`;
//                     window.location.href = "venues.html";
//                 }else{
//                     $('#loginFailed').html("Failed to log in");
//                 }
//             }
//         });
//     })
//}