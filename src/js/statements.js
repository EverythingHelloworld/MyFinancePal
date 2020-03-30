$('document').ready(() => {

  const customer = sessionStorage.getItem('CustomerID');
  const account = sessionStorage.getItem('AccountID');

  addBackButton();
  $.getJSON(`../php/getAccountsTransactions.php?customerID=${customer_id}`, (data) => {
    accountTransactions = getAccountTransactions(data, account_id);
    sortAccountTransactions(accountTransactions);
    handleSubmit(accountTransactions);
  });

});

addBackButton = () => {
  $("#back-button-container").append(`<Button id='back-button' class="btn btn-secondary" style="float:left; margin-bottom:10"><i class="fas fa-arrow-circle-left"></i><span class="h6"> My Bank Accounts<span></Button>`);
  $('#back-button').click(() => {
    window.location.href = "main.html";
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

generateStatement = (data) => {
  let statement = new jsPDF();

}