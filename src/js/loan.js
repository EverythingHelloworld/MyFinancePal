$("document").ready(function () {
    var selectedPurpose;
    var selectedAmount;
    // If a customer is not logged in <- if the customerID cookie exists
    // hide page content and redirect to login page
    redirectToLoginIfCustomerCookieNotSet();
    setActiveNavLink();
    const session_customer_id = Cookies.get('customerID');

    $.getJSON(`../php/getAccountInfo.php?id=${session_customer_id}`, function (data) 
    {
        for (var i = 0; i < data.customer.length; i++) 
        {
            $("#accountSelect").append(`<option>${data.customer[i].AccountID}</option>`);
        }
    });

    $("#accountSelect").change(function() 
    {   
        $("#purpose").css("display", "block");
        $("#FirstOption").remove();
    });

    $("#loanPurpose").change(function() 
    {   
        selectedPurpose = $("#loanPurpose").val();
        console.log(selectedPurpose);
        $("#firstOption").remove();
        $("#loanAmount").css("display", "block");
    });

    $('#amountToBorrow').change(() => {
        selectedAmount = parseFloat($("#amountToBorrow").val());
        $("#1stOption").remove();
        $('#repaySelect').empty();

        var interest = selectedAmount*0.08
        var totalPlusInterest = selectedAmount+interest;
        console.log(totalPlusInterest);

        $('#repaySelect').append(`<option>\u20AC${totalPlusInterest/12} Per Month Over 1 Year</option>`);
        $('#repaySelect').append(`<option>\u20AC${totalPlusInterest/24} Per Month Over 2 Year</option>`);
        $('#repaySelect').append(`<option>\u20AC${totalPlusInterest/36} Per Month Over 3 Year</option>`);
        $('#repaySelect').append(`<option>\u20AC${totalPlusInterest/48} Per Month Over 4 Year</option>`);
        $('#repaySelect').append(`<option>\u20AC${totalPlusInterest/60} Per Month Over 5 Year</option>`);

        $("#repayAmount").css("display", "block");
        $("#applyBtn").css("display", "block");
     });

     $('#repaySelect').change(() => {
     });
})
