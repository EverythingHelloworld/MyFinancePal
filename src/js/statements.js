var year = 0, from_month = 0, to_month = 0;
$('document').ready(() => {

  const customer_id = sessionStorage.getItem('CustomerID');
  const account_id = sessionStorage.getItem('AccountID');

  addBackButton();
  $.getJSON(`../php/getAccountsTransactions.php?customerID=${customer_id}`, (data) => {
    populateSelectYears(data, account_id)
    accountTransactions = getAccountTransactions(data, account_id);
    sortAccountTransactions(accountTransactions);
    console.log(accountTransactions);
    handleSelectChanges();
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

handleSelectChanges = () => {
  $('#year-select').change(() => {
    $('#from-month-select').attr('disabled', false);
    year = $('#year-select').val();
    console.log("year ", year, "from ", from_month, "to ", to_month);

    if (year == 0) {
      $('#from-month-select-container').attr("style", "display: none");
      $('#to-month-select-container').attr("style", "display: none");
      $('#from-month-select').val('0');
      $('#to-month-select').val('0');
      from_month = 0;
      to_month = 0;
    }
    else {
      $('#from-month-select-container').attr("style", "display: block");
    }
  });


  $('#from-month-select').change(() => {
    from_month = $('#from-month-select').val();
    if (from_month != 0) {
      $('#to-month-select-container').attr("style", "display: block");
      appendToSelect(from_month);
      console.log("year ", year, "from ", from_month, "to ", to_month);
    }
    else {
      $('#to-month-select-container').attr("style", "display: none");
    }
  });

  $('#to-month-select').change(() => {
    to_month = $('#to-month-select').val();
    console.log("year ", year, "from ", from_month, "to ", to_month);
  });



}

handleSubmit = (accountTransactions) => {
  $('#submitBtn').on('click', () => {
    console.log("year: ", year, "from: ", from_month, "to", to_month);
    let data = filterTransactionData(accountTransactions, year, from_month, to_month);
    generateStatement(data);
  });
}


appendToSelect = (month) => {
  $('#to-month-select').empty();
  let values = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  for (i = parseInt(month) - 1; i < values.length; i++) {
    $('#to-month-select').append(`<option value=${values[i]}>${months[i]}</option>`);
  }
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

generateStatement = (data) => {
  if (data[0].Transactions.length > 0) {
    let statement = new jsPDF();
    statement.setFontSize(14);
    statement.text(10, 10, "Your MyFinancePal Bank Account Statement")
    statement.text(10, 20, "Account: ")
    statement.text(10, 30, "Transactions From: All-Time")
    statement.setFontSize(14);
    for (i in data) {
      statement.text(30, 20, data[i].IBAN.toString());
      statement.setFontSize(10);
      statement.text(10, 40, "Date");
      statement.text(50, 40, "Description");
      statement.text(90, 40, "Type");
      statement.text(130, 40, "Amount");
      statement.text(170, 40, "Closing Balance");
    }
    for (j in data[i].Transactions) {
      let ClosingBalance = parseFloat(data[i].Transactions[j].ClosingBalance).toFixed(2).toString();
      statement.text(10, (parseFloat(j * 10) + 50), formatDate(data[i].Transactions[j].Date));
      statement.text(50, (parseFloat(j * 10) + 50), data[i].Transactions[j].Description);
      statement.text(90, (parseFloat(j * 10) + 50), data[i].Transactions[j].Type);
      statement.text(130, (parseFloat(j * 10) + 50), data[i].Transactions[j].Amount);
      statement.text(170, (parseFloat(j * 10) + 50), ClosingBalance);
    }
    statement.save('statement.pdf');
  }
}


filterTransactionData = (accountTransactions, from, to) => {
  dataToReturn = [];
  for (i in accountTransactions) {
    dataToReturn.push({
      "IBAN": accountTransactions[i].IBAN,
      "CurrentBalance": accountTransactions[i].CurrentBalance,
      "Transactions": []
    })
  }

  for (i in dataToReturn) {
    for (j in accountTransactions[i].Transactions) {
      if (accountTransactions[i].Transactions[j].Date.substr(0, 4) === year) {
        dataToReturn[i].Transactions.push({
          "Date": accountTransactions[i].Transactions[j].Date,
          "Description": accountTransactions[i].Transactions[j].Description,
          "Type": accountTransactions[i].Transactions[j].Type,
          "Amount": accountTransactions[i].Transactions[j].Amount,
          "ClosingBalance": accountTransactions[i].Transactions[j].ClosingBalance
        })
      }
    }
  }
  console.log(dataToReturn[0].Transactions.length);
  return dataToReturn;
}
