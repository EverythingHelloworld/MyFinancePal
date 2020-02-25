$("document").ready(function () {
    // If a customer is not logged in <- if the customerID cookie exists
    // hide page content and redirect to login page
    if (Cookies.get('customerID') === undefined) {
        $('#jumbotron').attr('style', 'display:none');
        $('#navbar').attr('style', 'display:none');
        window.location.href = 'login.html';
    }
    else {
        setActiveNavLink();
    }
})
