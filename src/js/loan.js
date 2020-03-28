$("document").ready(function () {
    var selectedPurpose;
    var selectedAmount;
    var selectedAccount;
    var repayAmount;
    // If a customer is not logged in <- if the customerID cookie exists
    // hide page content and redirect to login page
    redirectToLoginIfCustomerCookieNotSet();
    setActiveNavLink();
    const session_customer_id = Cookies.get('customerID');

    $.getJSON(`../php/getAccountInfo.php?id=${session_customer_id}`, function (data) 
    {
        for (var i = 0; i < data.customer.length; i++) 
        {
            $("#accountSelect").append(`<option value = "${data.customer[i].AccountID}">Account Ending in ${data.customer[i].IBAN.substr(data.customer[i].IBAN.length - 4)}</option>`);
        }
    });

    $("#accountSelect").change(function() 
    {   selectedAccount = $("#accountSelect").val(); 
        console.log(selectedAccount);
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
        repayAmount = "undefined";
        $("#1stOption").remove();
        $('#repaySelect').empty();

        var interest = selectedAmount*0.08
        var totalPlusInterest = selectedAmount+interest;
        console.log(totalPlusInterest);
        $('#repaySelect').append(`<option id = 'option'>Choose a Payment Plan...</option>`);
        $('#repaySelect').append(`<option>&euro;${totalPlusInterest/12} Per Month Over 1 Year</option>`);
        $('#repaySelect').append(`<option>&euro;${totalPlusInterest/24} Per Month Over 2 Years</option>`);
        $('#repaySelect').append(`<option>&euro;${totalPlusInterest/36} Per Month Over 3 Years</option>`);
        $('#repaySelect').append(`<option>&euro;${totalPlusInterest/48} Per Month Over 4 Years</option>`);
        $('#repaySelect').append(`<option>&euro;${totalPlusInterest/60} Per Month Over 5 Years</option>`);

        $("#repayAmount").css("display", "block");
     });

     $('#repaySelect').change(() => {
        $("#option").remove();
        $("#applyBtn").css("display", "block");
        repayAmount = $('#repaySelect').val();
        console.log(repayAmount);
     });

     $("#applyBtn").click(function () 
     {
        if(repayAmount == "undefined")
        {
            $('#applyBtn').append('<br><div id=errorMessage></div>');
            $('#errorMessage').attr('class', 'alert alert-danger text-center');
            $('#errorMessage').attr('role', 'alert');
            $('#errorMessage').text("Please select a County.");
        }
        else
        {
            repayAmount = repayAmount.replace(repayAmount.charAt(0), "€");
            $.getJSON(`../php/insertLoan.php?accountId=${selectedAccount}&amount=${selectedAmount}&repayAmount=${repayAmount}&purpose=${selectedPurpose}`, function (data) 
            {
            });
        }
    });
})
