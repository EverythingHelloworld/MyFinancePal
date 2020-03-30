var year, from_month, to_month;
$('document').ready(() => {

  const customer_id = sessionStorage.getItem('CustomerID');
  const account_id = sessionStorage.getItem('AccountID');

  addBackButton();
  $.getJSON(`../php/getAccountsTransactions.php?customerID=${customer_id}`, (data) => {
    populateSelectYears(data, account_id)
    accountTransactions = getAccountTransactions(data, account_id);
    sortAccountTransactions(accountTransactions);
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
  });

  $('#from-month-select').change(() => {
    from_month = $('#from-month-select').val();
    if (from_month != 0) {
      $('#to-month-select-container').attr("style", "display: block");
      appendToSelect(from_month);
    }
    else {
      $('#to-month-select-container').attr("style", "display: none");
    }
  });

  $('#to-month-select').change(() => {
    to_month = $('#to-month-select').val();
    console.log(to_month);
  });

}

handleSubmit = (accountTransactions) => {
  $('#submitBtn').on('click', () => {
    console.log("year: ", year, "from: ", from_month, "to", to_month);
    let data = filterStatementData(accountTransactions);
    generateStatement(data);
  });
}


appendToSelect = (month) => {
  console.log(parseInt(month));
  $('#to-month-select').empty();
  let values = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  for (i = parseInt(month) - 1; i < values.length; i++) {
    console.log(values[i]);
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
  let statement = new jsPDF();
}