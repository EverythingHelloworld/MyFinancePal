$("document").ready(() => {
  // If a customer is not logged in <- if the customerID cookie exists
  // hide page content and redirect to login page
  if (Cookies.get('customerID') === undefined) {
    $('#jumbotron').attr('style', 'display:none');
    $('#navbar').attr('style', 'display:none');
    window.location.href = 'login.html';
  }
  else {
    setActiveNavLink();
    const session_customer_id = Cookies.get('customerID');
    getPageData(session_customer_id); // -> pass session_customer_id to return and display all customer data
  }
});

getPageData = (customerID) => {
  // Query the MyFinancePal database for the accounts associated with the current customer
  $.getJSON(`../php/getCustomerAccounts.php?customerID=${customerID}`, (customerAccountData) => {
    let accounts = []
    let transactions = [];
    let accountsAndTransactions = [];
    accounts = customerAccountData.CustomerAccounts;

    // Query the MyFinancePal database for the transactions associated to the current customers accounts
    $.getJSON(`../php/getAccountsTransactions.php?customerID=${customerID}`, (accountsTransactionData) => {
      transactions = accountsTransactionData.accountTransactions;
      // console.log('accounts', accounts);
      // console.log('account transactions', accountsTransactions);
      accountsAndTransactions = combineAccountsAndTransactions(accounts, transactions);
      accountsAndTransactions = sortAccountsAndTransactions(accountsAndTransactions);
      console.log("accountsAndTransactions", accountsAndTransactions);
      appendCustomerAccounts(accountsAndTransactions);
      appendCustomerAccountsTransactions(accountsAndTransactions);
    });

  });
}

combineAccountsAndTransactions = (accounts, transactions) => {
  let dataToReturn = [];
  for (i in accounts) {
    dataToReturn.push({
      "AccountID": accounts[i].AccountID,
      "AccountType": accounts[i].AccountType,
      "IBAN": accounts[i].IBAN,
      "BIC": accounts[i].BIC,
      "OpeningDate": accounts[i].OpeningDate,
      "OpeningBalance": accounts[i].OpeningBalance,
      "CurrentBalance": accounts[i].CurrentBalance,
      "Transactions": []
    })
  }
  for (i in dataToReturn) {
    for (j in transactions) {
      if (dataToReturn[i].AccountID == transactions[j].AccountID) {
        dataToReturn[i].Transactions.push({
          "TransactionID": transactions[j].TransactionID,
          "Date": transactions[j].TransDate,
          "Type": transactions[j].Type,
          "Description": transactions[j].Description,
          "Amount": transactions[j].Amount,
          "Category": transactions[j].Category,
          "ClosingBalance": null
        });
      }

    }
  }
  return dataToReturn;
}

sortAccountsAndTransactions = (accountsAndTransactions) => {
  let dataToReturn = accountsAndTransactions;
  let currentBalance = 0;
  for (i in dataToReturn) {
    currentBalance = parseFloat(dataToReturn[i].OpeningBalance);
    for (j in dataToReturn[i].Transactions) {
      if (dataToReturn[i].Transactions[j].Type == "Credit") {
        dataToReturn[i].Transactions[j].ClosingBalance = currentBalance + parseFloat(dataToReturn[i].Transactions[j].Amount);
        currentBalance += parseFloat(dataToReturn[i].Transactions[j].Amount);
      }
      if (dataToReturn[i].Transactions[j].Type == "Debit") {
        dataToReturn[i].Transactions[j].ClosingBalance = currentBalance - parseFloat(dataToReturn[i].Transactions[j].Amount);
        currentBalance -= parseFloat(dataToReturn[i].Transactions[j].Amount);
      }
    }
  }
  return dataToReturn;
}

appendCustomerAccounts = (accounts) => {
  $('#accounts-collapse-container').append(`<table class="table table-borderless"><thead class><tr scope="row"><th><h3 class="display-4">My Bank Accounts</h3></th></tr></thead></table><div id="accordion"></div>`);
  for (i in accounts) {
    $('#accounts-collapse-container').append(`
     <div class="card">
        <div class="card-header" height="100px" id="account-${i}-heading">
           <h4 class="mb-0">
           <div class="container-fluid">
              <div class="row">
                 <div class="col md">
                    <button id="btn-collapse-${i}" class="btn btn-link" data-toggle="collapse" data-target="#account-${i}-collapse" aria-expanded="false" aria-controls="account-${i}-collapse">
                       <i id="btn-collapse-symbol${i}" style="font-size: 42px;" class="fas fa-plus-circle"></i>
                    </button>
                 </div>  
                 <div class="col md">
                    <h4>${accounts[i].AccountType} Account ~${accounts[i].IBAN.substr(16)}</h4>
                 </div>     
                 <div class="col md">
                 </div>    
                 <div class="col md">
                 <h4 class="h5">Balance: <br><span class="text-muted">&euro;${accounts[i].CurrentBalance}</span></h4>
              </div>     
              </div>
           </h5>
        </div>
  
     <div id="account-${i}-collapse" class="collapse hide" aria-labelledby="account-${i}-heading" data-parent="#accordion">
        <div id="account-${i}-body" class="card-body">
        </div>
     </div></div>`);
  }
}

appendCustomerAccountsTransactions = (accounts) => {
  for (i in accounts) {
    accounts[i].Transactions.reverse();
  }

  for (i in accounts) {
    $("#account-" + i + "-body").append(`<table class="table table-striped table-bordered"><thead class="thead-dark"><tr><th scope="row" colspan="4">My Account Details</th></tr><tr><th scope="col">Account Type</th><th scope="col">IBAN</th><th scope="col">BIC</th></tr></thead><tbody><tr scope="row"><td>${accounts[i].AccountType}</td><td>${accounts[i].IBAN}</td><td>${accounts[i].BIC}</td></tr></tbody></table>${(accounts[i].Transactions.length > 0 ? `<table class="table table-striped table-bordered" width=80% id="table${i}" padding=1><thead class="thead-dark"><tr><th scope="row" colspan="4">My Recent Transactions</th></tr><tr><th scope="col">Date</th><th scope="col">Description</th><th scope="col">Amount</th><th scope="col">Balance</th><tr></thead><tbody id="table${i}-body"></tbody></table>` : `<table class="table table-borderless><thead><tr scope="row><th class="h4">There isn't any transactions on this account</th></tr></thead></tabe>`)}`);
    $("#account-" + i + "-body").append(`<div class="btn-group" style=float:right; margin:10 role="group" aria-label="account-options">
     <div id=account-buttons>
        <button type="button" id=${accounts[i].AccountID}-payee-btn class="btn btn-secondary">Manage Payees</button>
        <button type="button" id=${accounts[i].AccountID}-statements-btn class="btn btn-secondary">View Statements</button>
        <button type="button" id=${accounts[i].AccountID}-transactions-btn class="btn btn-secondary">View All Transactions</button>
     </div>
     </div><br>`);
    for (j in accounts[i].Transactions) {
      if (j < 25 && accounts[i].Transactions.length > 0) { //number of recent transactions to show
        $('#table' + i + "-body").append(`<tr scope="row"><td>${formatDate(accounts[i].Transactions[j].Date)}</td><td>${accounts[i].Transactions[j].Description}</td><td>${accounts[i].Transactions[j].Type == "Debit" ? "-" + parseFloat(accounts[i].Transactions[j].Amount).toFixed(2) : parseFloat(accounts[i].Transactions[j].Amount).toFixed(2)}</td ><td>${accounts[i].Transactions[j].ClosingBalance.toFixed(2)}</td></tr > `);
      }
    }

  }
  bindCustomerAccountButtonFunctions(accounts);
}

bindCustomerAccountButtonFunctions = (accounts) => {
  let account_buttons = $('#account-buttons > button');
  for (let i = 0; i < account_buttons.length; i++) {
    let button = account_buttons[i];
    let button_id = account_buttons[i].id;
    button.onclick = () => {
      appendRedirectInstructions(button_id, accounts);
    };
  }
}

appendRedirectInstructions = (button_id, accounts) => {
  for (i in accounts) {
    if (button_id === accounts[i].AccountID + "-payee-btn") {
      console.log(accounts[i].AccountID + " payee");
    }
    if (button_id === accounts[i].AccountID + "-statements-btn") {
      console.log(accounts[i].AccountID + " statements");
    }
    if (button_id === accounts[i].AccountID + "-transactions-btn") {
      console.log(accounts[i].AccountID + " transactions");
      sessionStorage.setItem("AccountID", accounts[i].AccountID);
      sessionStorage.setItem("CustomerID", 1);
      window.location.href = 'transactionTester.html';
    }
  }
}