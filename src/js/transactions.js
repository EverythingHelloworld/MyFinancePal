$("document").ready(() => {
  console.log(Cookies.get('customerID'));
  const customer = sessionStorage.getItem('CustomerID');
  const account = sessionStorage.getItem('AccountID');
  getAccountTransactionData(customer, account); // -> pass session_customer_id to return and display all customer data
  bindButtonFunction();
  handleLogout();
});


getAccountTransactionData = (customer_id, account_id) => {
  $.getJSON(`../php/getAccountsTransactions.php?customer_id=${customer_id}`, (data) => {
    let accountTransactions = []; //array to store account transactions
    accountTransactions = getAccountTransactions(data, account_id);
    sortAccountTransactions(accountTransactions);
    appendAccountTransactions(accountTransactions);
  });
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
    //console.log(accounts[i]);
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

appendAccountTransactions = (account) => {
  for (i in account) {
    account[i].Transactions.reverse();
  }

  for (i in account) {
    $("#account-transactions-container").append(`<Button id='back-button' class="btn btn-secondary" style="float:left; margin-bottom:10">Back to Accounts</Button>`);
    $("#account-transactions-container").append(`<table class="table table-striped border" margin: 0 auto width=80% id="table${i}" padding=1><thead><tr><th scope="col">Date</th><th scope="col">Description</th><th scope="col">Category</th><th scope="col">Amount</th><th scope="col">Balance</th><tr></thead><tbody id="table${i}-body"></tbody></table>`);
    for (j in account[i].Transactions) {
      if (j < 25) { //number of recent transactions to show
        $(`#table${i}-body`).append(`<tr scope="row"><td>${formatDate(account[i].Transactions[j].Date)}</td><td>${account[i].Transactions[j].Description}</td><td>${account[i].Transactions[j].Category}</td><td>${account[i].Transactions[j].Type == "Debit" ? "-" + parseFloat(account[i].Transactions[j].Amount).toFixed(2) : parseFloat(account[i].Transactions[j].Amount).toFixed(2)}</td ><td>${account[i].Transactions[j].ClosingBalance.toFixed(2)}</td></tr> `);
      }
    }

  }
}

