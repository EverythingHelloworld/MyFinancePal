var customerID;
var payeeInDatabase = false;
$.ajaxSetup({
  async: false
});

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
function handleAddPayee() {
  $('#btnAddPayee').click(() => {
    var payeeName; var IBAN; var BIC;
    payeeName = $('#payeeName').val();
    IBAN = $('#IBAN').val();
    BIC = $('#BIC').val();
    if (isValidNewPayee(payeeName, IBAN, BIC)) {
      if (inDatabase(IBAN) === false) {
        $.post("../php/addPayee.php",
          {
            'PayeeName': $('#payeeName').val(),
            'IBAN': $('#IBAN').val(),
            'BIC': $('#BIC').val(),
            'customerID': customerID
          }).done(() => {
            $('#add').empty();
            $('#add').html('<br><div id=successMessage></div>');
            $('#successMessage').attr('class', 'alert alert-success text-center');
            $('#successMessage').attr('role', 'alert');
            $('#successMessage').text('Payee successfully added.');
            setInterval(redirectToPayeesHome, 2500);
          }).fail(() => {
            $('#add').empty();
            $('#add').html('<br><div id=errorMessage></div>');
            $('#errorMessage').attr('class', 'alert alert-danger text-center');
            $('#errorMessage').attr('role', 'alert');
            $('#errorMessage').text('Error connecting to database.');
            setInterval(redirectToPayeesHome, 2500);
          });
      }
      else {
        $('#add').empty();
        $('#add').html('<br><div id=errorMessage></div>');
        $('#errorMessage').attr('class', 'alert alert-danger text-center');
        $('#errorMessage').attr('role', 'alert');
        $('#errorMessage').text('There is already a payee with this bank account in your payees.');
        setInterval(redirectToPayeesHome, 2500);

      }
    }
  });
}


function redirectToPayeesHome() {
  window.location.href = 'managePayees.html';
}

function isValidNewPayee(payeeName, IBAN, BIC) {
  validName = false;
  validIBAN = false;
  validBIC = false;
  var namePattern = new RegExp("^[a-zA-Z_]+( [a-zA-Z_]+)*$");
  var IBANPattern = new RegExp("^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$");
  var BICPattern = new RegExp("^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$");
  if (payeeName !== undefined && payeeName.length > 0 && namePattern.test(payeeName)) {
    validName = true;
  }
  if (IBAN !== undefined && IBAN.length > 0 && IBANPattern.test(IBAN)) {
    if (IBAN.charAt(0).match("^[a-zA-Z]") && IBAN.charAt(1).match('^[a-zA-Z]')) {
      validIBAN = true;
    }
  }
  if (BIC !== undefined && BIC.length > 0 && BICPattern.test(BIC)) {
    if (BIC.charAt(0).match("^[a-zA-Z]") && BIC.charAt(1).match('^[a-zA-Z]')) {
      s = BIC.substr(0, 5);
      validBIC = true;
      for (i in s) {
        if (!s.charAt(i).match("^[a-zA-Z]")) {
          validBIC = false;
        }
      }
    }
    if (BIC.length < 9) {
      validBIC = false;
    }
  }

  if (validName && validIBAN && validBIC) {
    $('#add-payee-error-alert-container').empty();
    return true;
  }
  else
    displayErrorMessage(validName, validIBAN, validBIC);

  return false;
}


function inDatabase(IBAN) {
  $.getJSON(`../php/getPayees.php?customerID=${customerID}`, (data) => {
    for (i in data.Payees) {
      if (data.Payees[i].IBAN === IBAN && data.Payees[i].CustomerID === customerID) {
        payeeInDatabase = true;
      }
    }
  });
  return payeeInDatabase;
}

/*Removes the default option from the remove payee dropdown 
after the customer has selected another option*/
function removeDefaultDropdownOptionOnChange() {
  $('#selectPayee').change(() => {
    $('#default').remove();
    $('#removePayeeBtn').attr('disabled', false);
  });
}

//Removes the payee the customer has selected from the db and refreshes the page
function handleRemovePayee() {
  $('#removePayeeBtn').click(() => {
    $.post("../php/deletePayee.php",
      { 'payeeID': $('#selectPayee option:selected').val() }
    ).done(() => {
      $('#delete').empty();
      $('#delete').html('<br><div id=successMessage></div>');
      $('#successMessage').attr('class', 'alert alert-success text-center');
      $('#successMessage').attr('role', 'alert');
      $('#successMessage').text('Payee successfully removed.');
      setInterval(redirectToPayeesHome, 2500);
    })
      .fail(() => {
        $('#delete').empty();
        $('#delete').html('<br><div id=errorMessage></div>');
        $('#errorMessage').attr('class', 'alert alert-danger text-center');
        $('#errorMessage').attr('role', 'alert');
        $('#errorMessage').text('Error connecting to database.');
        setInterval(redirectToPayeesHome, 2500);
      });
  })
}

//Gets the customer's payee list and adds their names to the remove payee dropdown
function addPayeesToDeleteDropdown(customerID) {
  //Creates dropdown and adds it to delete tab
  $('#delete').html('<br><div class="input-group"><select class="custom-select" id="selectPayee">' +
    '<option selected id="default">Remove a payee...</option></select><br><div class="input-group-append">' +
    '<button class="btn btn-primary" type="button" id="removePayeeBtn" disabled>Remove</button></div></div>')

  //Gets customer's list of payees
  $.getJSON(`../php/getPayees.php?customerID=${customerID}`, function (data) {
    payeeData = data;

    //If the customer has payees registered, add them to the dropdown, else display an info message.
    if (payeeData.Payees.length > 0) {
      for (var i = 0; i < payeeData.Payees.length; i++) {
        $('#selectPayee').append(`<option value="${payeeData.Payees[i].PayeeID}">${payeeData.Payees[i].Name}</option>`);
      }
    } else {
      $('#delete').html('<br><div id=infoMessage class="alert alert-info text-center"' +
        ' role=alert>There are no payees registered on your accounts</div>');
    }
  })

}

function displayErrorMessage(validPayee, validIBAN, validBIC) {
  var errorMessage;
  if (!validPayee && !validIBAN && !validBIC) {
    errorMessage = "Payee name, IBAN, and BIC are invalid";
  }
  else if (!validPayee && !validIBAN) {
    errorMessage = "Payee name and IBAN are invalid";
  }
  else if (!validPayee && !validBIC) {
    errorMessage = "Payee name BIC are invalid";
  }
  else if (!validIBAN && !validBIC) {
    errorMessage = "IBAN and BIC are invalid";
  }
  else if (!validPayee) {
    errorMessage = "Payee name is invalid";
  }
  else if (!validIBAN) {
    errorMessage = "IBAN is invalid";
  }
  else if (!validBIC) {
    errorMessage = "BIC is invalid";
  }
  $('#add-payee-error-alert').attr('class', 'alert alert-danger');
  $('#add-payee-error-alert').attr('role', 'alert');
  $('#add-payee-error-alert').text(errorMessage);
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
    if ($('#payeeTable').length > 0) {
      $('#payeeTable').empty();
    }

    //If the customer has payees registered, add them to the table, else display an info message.
    if (payeeData.Payees.length > 0) {
      $('#home').append('<br><table class="table table-striped table-bordered" id="payeeTable"><thead class="thead-dark"><tr><th ' +
        'scope="row" colspan="3" class="text-center" style="font-size:30;font-weight:bold;">My Payees</th></tr><tr><th scope="col">Payee Name</th>' +
        '<th scope="col">IBAN</th><th scope="col">BIC</th></tr></thead><tbody id="tableBody"></tbody></table>');
      for (var i = 0; i < payeeData.Payees.length; i++) {
        $('#tableBody').append(`<tr scope="row"><td>${payeeData.Payees[i].Name}</td><td>${payeeData.Payees[i].IBAN}</td><td>${payeeData.Payees[i].BIC}</td></tr>`);
      }
    } else {
      $('#home').html('<br><div id=infoMessage></div>');
      $('#infoMessage').attr('class', 'alert alert-info text-center');
      $('#infoMessage').attr('role', 'alert');
      $('#infoMessage').text('There are no payees registered on your accounts.');
    }
  })
}