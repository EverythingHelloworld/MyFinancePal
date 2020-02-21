$("document").ready(function(){
    getCustomerIDCookie();
    handleLogout();
})

function getCustomerIDCookie(){
    var customerID = Cookies.get('customerID');
    if (customerID != undefined) {
    //do pin stuff here
    console.log('logged in: ', Cookies.get('customerID') + ' <- cookie here');
    } else {     
        window.location.href = "login.html";
    }
}

function handleLogout(){
    $("#btnLogout").click(function (){
        document.cookie = "customerID=''; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        console.log(Cookies.get('customerID') + '<- cookie here');
    }) 
} 