var year, month;
$("document").ready(() => {
  // If a customer is not logged in <- if the customerID cookie exists
  // hide page content and redirect to login page
  redirectToLoginIfCustomerCookieNotSet();
  // else
  // get the customer id and account id from sessionStorage
  // and display all transactions for the customer account
  const customer = sessionStorage.getItem('CustomerID');
  const account = sessionStorage.getItem('AccountID');
  $('#account-number-container').append(`<span class="h6" style="margin-top:10px;">Displaying all of your transactions for account ${account}<br>`);
  getAccountTransactionData(customer, account); // -> pass session_customer_id to return and display all customer data
  $("#back-button-container").append(`<Button id='back-button' class="btn btn-secondary" style="float:left; margin-bottom:10"><i class="fas fa-arrow-circle-left"></i><span class="h6"> My Bank Accounts<span></Button>`);
  $('#back-button').click(() => {
    window.location.href = "main.html";
  });
});


getAccountTransactionData = (customer_id, account_id) => {
  $.getJSON(`../php/getAccountsTransactions.php?customerID=${customer_id}`)
    .done((data) => {
      accountTransactions = getAccountTransactions(data, account_id);
      sortAccountTransactions(accountTransactions);
      populateSelectYears(data, account_id);
      appendAccountTransactions('0', '0', accountTransactions);
      handleSubmitButton(accountTransactions);
    })
    .fail(() => {
      alert("Error: Failed to connect to database");
      window.location.href = "login.html";
      Cookies.remove('customerID');
      Cookies.remove('loggedIn');
      sessionStorage.clear();
    })
}

//Extract all customer bank accounts
//This creates an array of each account the customer has 
getAccountTransactions = (data, account_id) => {
  let account = [];
  //for every  object in data.accountTransactions
  //push only bank account information to the array (Account number, IBAN, opening balance,)
  for (let i in data.accountTransactions) {
    if (data.accountTransactions[i].AccountID == account_id) {
      account.push({ "AccountID": data.accountTransactions[i].AccountID, "IBAN": data.accountTransactions[i].IBAN, "OpeningBalance": data.accountTransactions[i].OpeningBalance, "CurrentBalance": data.accountTransactions[i].CurrentBalance, "Transactions": [] });
    }
  }

  account = _.uniq(account, (x) => { return parseInt(x.AccountID) });
  for (i in account) {
    for (j in data.accountTransactions) {
      if (account[i].AccountID == data.accountTransactions[j].AccountID) {
        account[i].Transactions.push({
          "TransactionID": data.accountTransactions[j].TransactionID,
          "Date": data.accountTransactions[j].TransDate,
          "Type": data.accountTransactions[j].Type,
          "Description": data.accountTransactions[j].Description,
          "Amount": data.accountTransactions[j].Amount,
          "Category": data.accountTransactions[j].Category,
          "ClosingBalance": null

        });
      }
    }
  }
  return account;
}


sortAccountTransactions = (accountTransactions) => {
  let currentBalance = 0;
  for (i in accountTransactions) {
    currentBalance = parseFloat(accountTransactions[i].OpeningBalance);
    for (j in accountTransactions[i].Transactions) {
      if (accountTransactions[i].Transactions[j].Type == "Credit") {
        accountTransactions[i].Transactions[j].ClosingBalance = currentBalance + parseFloat(accountTransactions[i].Transactions[j].Amount);
        currentBalance += parseFloat(accountTransactions[i].Transactions[j].Amount);
      }
      if (accountTransactions[i].Transactions[j].Type == "Debit") {
        accountTransactions[i].Transactions[j].ClosingBalance = currentBalance - parseFloat(accountTransactions[i].Transactions[j].Amount);
        currentBalance -= parseFloat(accountTransactions[i].Transactions[j].Amount);
      }
    }
  }
}

appendAccountTransactions = (yr, mnth, account) => {
  let year = yr;
  let month = mnth;
  let temp = [];
  let dataToDisplay = [];
  for (i in account) {
    for (j in account[i].Transactions) {
      temp.push(account[i].Transactions[j]);
    }
  }
  if (year === '0' && month === '0') {
    dataToDisplay = temp;
  }
  else if (year != '0' && month === '0') {
    dataToDisplay = _.filter(temp, (t) => { return t.Date.substr(0, 4) === year });
  }
  else if (year === '0' && month != '0') {
    dataToDisplay = _.filter(temp, (t) => { return t.Date.substr(5, 2) === month });
  }
  else {
    dataToDisplay = _.filter(temp, (t) => { return t.Date.substr(0, 4) === year && t.Date.substr(5, 2) === month });
  }
  $('#account-transactions-container').empty();
  if (dataToDisplay === undefined || dataToDisplay.length == 0) {
    $("#account-transactions-container").append(`<div class="alert alert-info" role="alert">There doesn't appear to be any transactions for the selected period</div>`);
  }
  else {
    dataToDisplay.reverse();
    $("#account-transactions-container").append(`<table class="table table-striped table-bordered" style="float:left;" width=100% id="table" padding=1><thead><tr><th scope="col">Date</th><th scope="col">Description</th><th scope="col">Category</th><th scope="col">Amount</th><th scope="col">Balance</th><tr></thead><tbody id="table-body"></tbody></table>`);
    for (let i = 0; i < dataToDisplay.length; i++) {
      $(`#table`).append(`<tr scope="row"><td>${formatDate(dataToDisplay[i].Date)}</td><td>${dataToDisplay[i].Description}</td><td>${dataToDisplay[i].Category}</td><td id="transAmount${i}">${dataToDisplay[i].Type == "Debit" ? "-" + parseFloat(dataToDisplay[i].Amount).toFixed(2) : parseFloat(dataToDisplay[i].Amount).toFixed(2)}</td ><td>${dataToDisplay[i].ClosingBalance.toFixed(2)}</td></tr> `);
      dataToDisplay[i].Type == "Debit" ? $(`#transAmount${i}`).attr('style', 'color:#ed2939; font-weight:bold;') : $(`#transAmount${i}`).attr('style', 'color:#50c878; font-weight:bold;');
    }
  }



}


handleSubmitButton = (accountTransactions) => {
  $('#submitBtn').on('click', () => {
    year = $('#year-select').val();
    month = $('#month-select').val();
    appendAccountTransactions(year, month, accountTransactions);
  })

}

populateSelectYears = (data, account_id) => {
  let years = [];
  for (i in data.accountTransactions) {
    if (data.accountTransactions[i].AccountID === account_id) {
      years.push(data.accountTransactions[i].TransDate.substr(0, 4));
    }
  }
  years = _.uniq(years).reverse();
  for (i in years) {
    $('#year-select').append(`<option value=${years[i]}>${years[i]}</option`);
  }
}