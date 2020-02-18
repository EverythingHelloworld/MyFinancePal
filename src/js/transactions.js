$("document").ready(() => {

  getCustomerData(1);

});

//Function
//For current customer session
//Retrieve all customer information from database [customer accounts and transactions for those accounts]
//1. Extract all customer bank accounts
//2. Extract all transactions and associate them with the correct bank account
//3. Append bank account collapse element to main.html
//4. Append all bank account transaction information to associated collapse element in main
getCustomerData = (customer_id) => {
  $.getJSON(`php/getAccountsTransactions.php?customer_id=${customer_id}`, (data) => {
    let customerAccounts = getCustomerAccounts(data);
    let accountTransactions = getCustomerAccountTransactions(customerAccounts, data);
    sortCustomerAccountTransactions(accountTransactions);
    console.log("Customer Accounts: " + JSON.stringify(customerAccounts));
    console.log(accountTransactions);
    appendAccountTransactions(accountTransactions);
  });
}

//Extract all customer bank accounts
//This creates an array of each account the customer has 
getCustomerAccounts = (data) => {
  let a = [];
  //for every  object in data.accountTransactions
  //push only necessary bank account information to the array
  for (let i in data.accountTransactions) {
    a.push({ "Account": i, "No": data.accountTransactions[i].accountID, "IBAN": data.accountTransactions[i].IBAN, "OpeningBalance": data.accountTransactions[i].OpeningBalance, "CurrentBalance": data.accountTransactions[i].CurrentBalance });
  }
  //extract single unique accounts from accounts array (check account number)
  return _.uniq(a, () => a.No);

}

//Extract all customer transactions and associate them with the correct bank account
//Creates a nested array of JSON objects for accounts and their associated transactions
getCustomerAccountTransactions = (customerAccounts, data) => {
  console.log(data);
  let t = [];

  for (let i in customerAccounts) {
    t.push({ "AccountID": customerAccounts[i].No, "openingBalance": customerAccounts[i].OpeningBalance, "Transactions": [] });
  }

  for (let i in t) {
    for (let j in data.accountTransactions) {
      if (t[i].AccountID == data.accountTransactions[j].accountID) {
        t[i].Transactions.push({
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
  return t;
}

sortCustomerAccountTransactions = (accountTransactions) => {
  let currentBalance = 0;
  for (i in accountTransactions) {
    currentBalance = parseFloat(accountTransactions[i].openingBalance);
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

appendAccountTransactions = (accountTransactions) => {
  $("#account-transactions").append(`<table width=80% id="table" border=1 padding=1><th style=text-align:center>Date</th><th th style=text-align:center>Description</th><th th style=text-align:center>Amount</th><th th style=text-align:center>Balance</th></table>`);
  for (i in accountTransactions) {
    for (j in accountTransactions[i].Transactions) {
      //console.log("test:" + accountTransactions[i].Transactions[j].Date);
      $('#table').append(`<tr><td>${accountTransactions[i].Transactions[j].Date}</td><td>${accountTransactions[i].Transactions[j].Description}</td><td>${accountTransactions[i].Transactions[j].Amount}</td><td>${accountTransactions[i].Transactions[j].ClosingBalance}</td></tr>`);
    }
  }

}