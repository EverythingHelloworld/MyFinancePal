var customerID;

$("document").ready(function () {
    // If a customer is not logged in <- if the customerID cookie exists
    // hide page content and redirect to login page
    redirectToLoginIfCustomerCookieNotSet();
    setActiveNavLink();
    handleLogout();
    getCustomerIDCookie();
    getCustomerPayees(customerID);
    getCustomerPayeesForDeleteDropdown();
    // setTabOnClickFunctions();  
})

function getCustomerPayeesForDeleteDropdown(customerID) {
  $.getJSON(`../php/getPayees.php?customerID=${customerID}`, function (data) {
    payeeData = data;
    console.log(payeeData);
    if($('#payeeDropdown').length > 0){
      $('#payeeDropdown').empty();
    }
    if (payeeData.Payees.length > 0) {
        for(var i=0; i < payeeData.Payees.length; i++){
          $('#dropdownMenuButton').append(`<a class="dropdown-item">${payeeData.Payees.Name}</a>`);
        }
    }else{
        $('#container').after('<div id=errorMessage></div>');
        $('#errorMessage').attr('class', 'alert alert-danger text-center');
        $('#errorMessage').attr('role', 'alert');
        $('#errorMessage').text('Error getting customer details from database.');
    }
  })
}

// function setTabOnClickFunctions() {
  // $('#home-tab a').on('click', function (e) {
  //   e.preventDefault()
  //   $(this).tab('show')
  // })

  // $('#add-tab a').on('click', function (e) {
  //   e.preventDefault()
  //   $(this).tab('show')
  // })

  // $('#delete-tab a').on('click', function (e) {
  //   e.preventDefault()

  //   $(this).tab('show')
  // })  
// }



function getCustomerIDCookie() {
    customerID = Cookies.get('customerID');
}

function getCustomerPayees(customerID) {
  $.getJSON(`../php/getPayees.php?customerID=${customerID}`, function (data) {
    payeeData = data;
    console.log(payeeData);
    if($('#payeeTable').length > 0){
      $('#payeeTable').empty();
    }
    if (payeeData.Payees.length > 0) {
        $('#home').append('<br><table class="table table-striped table-bordered" id="payeeTable"><thead class="thead-dark"><tr><th ' +
        'scope="row" colspan="3" class="text-center" style="font-size:30;font-weight:bold;">My Payees</th></tr><tr><th scope="col">Payee Name</th>' +
        '<th scope="col">IBAN</th><th scope="col">BIC</th></tr></thead><tbody id="tableBody"></tbody></table>');
        for(var i=0; i < payeeData.Payees.length; i++){
          $('#tableBody').append(`<tr scope="row"><td>${payeeData.Payees[i].Name}</td><td>${payeeData.Payees[i].IBAN}</td><td>${payeeData.Payees[i].BIC}</td></tr>`);
        }
    }else{
        $('#container').after('<div id=errorMessage></div>');
        $('#errorMessage').attr('class', 'alert alert-danger text-center');
        $('#errorMessage').attr('role', 'alert');
        $('#errorMessage').text('Error getting customer details from database.');
    }
  })
}