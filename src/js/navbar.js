$("document").ready(function () {
    $("#navbar").html("<nav class='navbar navbar-expand-lg navbar-dark bg-dark' style='list-style-type:none !important;'>" +
            "<button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarTogglerDemo01'" +
            "aria-controls='navbarTogglerDemo01' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span>" +
            "</button><div class='collapse navbar-collapse' id='navbarTogglerDemo01'><ul id='list' class='nav nav-pills nav-fill' style='width:100%'>" +
            "<li class='nav-item'><a class='nav-link' href='../html/main.html' class='external' style='color:rgba(255,255,255,.5);'>Home</a>" +
            "</li><li class='nav-item'><a class='nav-link' href='../html/analytics.html' class='external' style='color:rgba(255,255,255,.5);'>Analytics</a>" +
            "</li><li class='nav-item'><a class='nav-link' href='../html/transfer.html' class='external' style='color:rgba(255,255,255,.5);'>Transfer</a>" +
            "</li><li class='nav-item'><a class='nav-link' href='../html/loan.html' class='external' style='color:rgba(255,255,255,.5);'>Loan</a>" +
            "</li></ul></div></nav><br/>");

    if (Cookies.get('customerID') !== undefined) {
            $('#list').append(`<li class='nav-item'><a class='nav-link' id='btnLogout' href='#' class='external' style='color:rgba(255,255,255,.5);'>Logout</a>`);
    }
})