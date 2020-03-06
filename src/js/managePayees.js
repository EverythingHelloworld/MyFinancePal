var customerID;

$("document").ready(function () {
    // If a customer is not logged in <- if the customerID cookie exists
    // hide page content and redirect to login page
    redirectToLoginIfCustomerCookieNotSet();
    setActiveNavLink();
    handleLogout();
    getCustomerIDCookie();
    getCustomerPayees(customerID);
    addPayeesToDeleteDropdown(customerID);
    removeDefaultDropdownOptionOnChange();
    handleRemovePayee();
    handleAddPayee();
})


/*On click handler for add payee button. Adds the data the customer has entered 
to a new row in the payee table in the db and then refreshes the page.*/
function handleAddPayee(){
  $('#btnAddPayee').click(() => {
    console.log('Name: ', $('#payeeName').val());
    console.log('IBAN: ', $('#IBAN').val());
    console.log('BIC: ', $('#BIC').val());
    console.log('customerID: ', customerID);
    $.post("../php/addPayee.php", {'PayeeName': $('#payeeName').val(), 'IBAN': $('#IBAN').val(), 'BIC': $('#BIC').val(), 'customerID': customerID}, function(data, status){
      alert('Data: ', data, ', Status: ', status);
    });
    // window.location.href = 'managePayees.html';
  });
}

/*Removes the default option from the remove payee dropdown 
after the customer has selected another option*/
function removeDefaultDropdownOptionOnChange(){
  $('#selectPayee').change(() => {
    $('#default').remove();
  });
}

//Removes the payee the customer has selected from the db and refreshes the page
function handleRemovePayee(){
  $('#removePayee').click(() => {
    $.post("../php/deletePayee.php", {'payeeID': $('#selectPayee option:selected').val()});
    window.location.href = 'managePayees.html';
  });
}

//Gets the customer's payee list and adds their names to the remove payee dropdown
function addPayeesToDeleteDropdown(customerID) {
    //Creates dropdown and adds it to delete tab
    $('#delete').html('<br><div class="input-group"><select class="custom-select" id="selectPayee">' +
    '<option selected id="default">Remove a payee...</option></select><br><div class="input-group-append">' +
    '<button class="btn btn-primary" type="button" id="removePayee">Remove</button></div></div>')

    //Gets customer's list of payees
    $.getJSON(`../php/getPayees.php?customerID=${customerID}`, function (data) {
      payeeData = data;

      //If the customer has payees registered, add them to the dropdown, else display an info message.
      if (payeeData.Payees.length > 0) {
          for(var i=0; i < payeeData.Payees.length; i++){
            $('#selectPayee').append(`<option value="${payeeData.Payees[i].PayeeID}">${payeeData.Payees[i].Name}</option>`);
          }
      }else{
        $('#delete').html('<br><div id=infoMessage class="alert alert-info text-center"' + 
        ' role=alert>There are no payees registered on your accounts</div>');
      }
    })

}

//Gets the customer ID cookie
function getCustomerIDCookie() {
    customerID = Cookies.get('customerID');
}

//Gets the customer's list of payees and displays them in a table in the home tab
function getCustomerPayees(customerID) {
  $.getJSON(`../php/getPayees.php?customerID=${customerID}`, function (data) {
    payeeData = data;

    //If the table already exists, clear it.
    if($('#payeeTable').length > 0){
      $('#payeeTable').empty();
    }

      //If the customer has payees registered, add them to the table, else display an info message.
    if (payeeData.Payees.length > 0) {
        $('#home').append('<br><table class="table table-striped table-bordered" id="payeeTable"><thead class="thead-dark"><tr><th ' +
        'scope="row" colspan="3" class="text-center" style="font-size:30;font-weight:bold;">My Payees</th></tr><tr><th scope="col">Payee Name</th>' +
        '<th scope="col">IBAN</th><th scope="col">BIC</th></tr></thead><tbody id="tableBody"></tbody></table>');
        for(var i=0; i < payeeData.Payees.length; i++){
          $('#tableBody').append(`<tr scope="row"><td>${payeeData.Payees[i].Name}</td><td>${payeeData.Payees[i].IBAN}</td><td>${payeeData.Payees[i].BIC}</td></tr>`);
        }
    }else{
        $('#home').html('<br><div id=infoMessage></div>');
        $('#infoMessage').attr('class', 'alert alert-info text-center');
        $('#infoMessage').attr('role', 'alert');
        $('#infoMessage').text('There are no payees registered on your accounts.');
    }
  })
}