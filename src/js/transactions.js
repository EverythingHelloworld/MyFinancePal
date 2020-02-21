$("document").ready(() => {
  let x = document.cookie;
  x = x.substr(11);
  //session__customer_account_id -> pull this from customer_id cookie
  getAccountTransactionData(1, x); // -> pass session_customer_id to return and display all customer data
  console.log(x);
});

//Function
//For current session
//Retrieve all customer transactional information from database [customer accounts and transactions associated to those accounts]
//1. Extract all customer bank accounts -> (data) -> getCustomerAccounts(), returns an array of JSON objects
//2. Extract all transactions and associate them with the correct bank account, returns a nested array of JSON objects
//3. Sort transactions for each account -> calculates and stores the closing balance for an account after each transaction
//4. Append bank account collapse element to main.html
//5. Append all bank account transaction information to associated collapse element in main
getAccountTransactionData = (customer_id, account_id) => {
  $.getJSON(`../php/getAccountsTransactions.php?customer_id=${customer_id}`, (data) => {
    console.log(data);
    let accountTransactions = []; //array to store account transactions
    accountTransactions = getAccountTransactions(data, account_id);
    console.log(accountTransactions);
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
    if (data.accountTransactions[i].accountID == account_id) {
      account.push({ "AccountID": data.accountTransactions[i].accountID, "IBAN": data.accountTransactions[i].IBAN, "OpeningBalance": data.accountTransactions[i].OpeningBalance, "CurrentBalance": data.accountTransactions[i].CurrentBalance, "Transactions": [] });
    }
  }
  account = _.uniq(account, (x) => { return parseInt(x.AccountID) });
  for (i in account) {
    //console.log(accounts[i]);
    for (j in data.accountTransactions) {
      if (account[i].AccountID == data.accountTransactions[j].accountID) {
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
    $("#account-transactions-container").append(`<table class="table table-striped border" margin: 0 auto width=80% id="table${i}" padding=1><thead><tr><th scope="col">Date</th><th scope="col">Description</th><th scope="col">Category</th><th scope="col">Amount</th><th scope="col">Balance</th><tr></thead><tbody id="table${i}-body"></tbody></table>`);
    for (j in account[i].Transactions) {
      if (j < 25) { //number of recent transactions to show
        $(`#table${i}-body`).append(`<tr scope="row"><td>${formatDate(account[i].Transactions[j].Date)}</td><td>${account[i].Transactions[j].Description}</td><td>${account[i].Transactions[j].Category}</td><td>${account[i].Transactions[j].Type == "Debit" ? "-" + parseFloat(account[i].Transactions[j].Amount).toFixed(2) : parseFloat(account[i].Transactions[j].Amount).toFixed(2)}</td ><td>${account[i].Transactions[j].ClosingBalance.toFixed(2)}</td></tr > `);
      }
    }

  }

}

