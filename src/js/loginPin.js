$("document").ready(function(){
    getCustomerIDCookie();
    // handleLogout();
})

function getCustomerIDCookie(){
    var customerID = Cookies.get('customerID');
    if (customerID != undefined) {
    //do pin stuff here
    console.log('logged in: ', Cookies.get('customerID') + ' <- cookie here');
    getCustomerPassword(customerID);
    } else {     
        window.location.href = "login.html";
    }
}

//working on this
function getCustomerPassword(id){
    console.log('id is: ', id);
    $.getJSON(`../php/getCustomerPassword.php?customerID=${id}`, function(data) {
        console.log(data);
        var customer = data.CustomerDetails[0];
        
        // var errorMessage;
        // if(data.CustomerDetails.length > 0){
        //         // matchPassword();
        // }else {
        //     errorMessage = 'Error getting customer details from database.';
        // }
    })
}

function matchPassword(){

}

// function handleLogout(){
//     $("#btnLogout").click(function (){
//         document.cookie = "customerID=''; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
//         console.log(Cookies.get('customerID') + '<- cookie here');
//     }) 
// } 