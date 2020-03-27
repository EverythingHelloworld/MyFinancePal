$("document").ready(function () {
    var selectedPurpose;
    var selectedAmount;
    // If a customer is not logged in <- if the customerID cookie exists
    // hide page content and redirect to login page
    redirectToLoginIfCustomerCookieNotSet();
    setActiveNavLink();

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
        selectedAmount+0.00;
        $('#repaySelect').empty();

        var interest = selectedAmount*0.08
        var totalPlusInterest = selectedAmount+interest;
        console.log(totalPlusInterest);

        $('#repaySelect').append(`<option>\u20AC${totalPlusInterest/12} per week over 1 year</option>`);
        $('#repaySelect').append(`<option>\u20AC${totalPlusInterest/24} per week over 2 year</option>`);
        $('#repaySelect').append(`<option>\u20AC${totalPlusInterest/36} per week over 3 year</option>`);
        $('#repaySelect').append(`<option>\u20AC${totalPlusInterest/48} per week over 4 year</option>`);
        $('#repaySelect').append(`<option>\u20AC${totalPlusInterest/60} per week over 5 year</option>`);


        $("#repayAmount").css("display", "block");
        $("#applyBtn").css("display", "block");
     });

     $('#repaySelect').change(() => {
     });
     
     
})
