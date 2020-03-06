$("document").ready(() => {
   // If a customer is not logged in <- if the customerID cookie exists
   // hide page content and redirect to login page
   redirectToLoginIfCustomerCookieNotSet();
   $.ajaxSetup({
      async: false
   });
   setActiveNavLink();
   // Retrieve the customer id for the current session <- customer that is currently logged in
   const session_customer_id = Cookies.get('customerID');
   sessionStorage.setItem("CustomerID", session_customer_id);
   getPageData(session_customer_id); // -> pass session_customer_id to return and display all page data for customer
});

// Function that retrvieves all data that needs to be
// displayed on the main page
getPageData = (customerID) => {
   // Query the MyFinancePal database for the accounts associated with the customer
   // that is currently logged in
   $.getJSON(`../php/getCustomerAccounts.php?customerID=${customerID}`)
      .done((customerAccountData) => {
         let accounts = []
         let transactions = [];
         let accountsAndTransactions = [];
         accounts = customerAccountData.CustomerAccounts;

         // Query the MyFinancePal database for the transactions associated to the accounts
         // of the customer that is currently logged in
         $.getJSON(`../php/getAccountsTransactions.php?customerID=${customerID}`)
            .done((accountsTransactionData) => {
               transactions = accountsTransactionData.accountTransactions;
               accountsAndTransactions = combineAccountsAndTransactions(accounts, transactions);
               accountsAndTransactions = sortAccountsAndTransactions(accountsAndTransactions);
               appendCustomerAccounts(accountsAndTransactions);
               appendCustomerAccountsTransactions(accountsAndTransactions);
               appendQuickTransferForm();
               bindAccountsToQuickTransferForm(accountsAndTransactions);
               handleTransferForm(accountsAndTransactions, customerID);
            })
            .fail(() => {
               console.log('database call failed for account transactions');
            })

      })
      .fail(() => {
         console.log('database call failed for customer account');
      })
}

// Function builds a JSON object that associates each account
// with that accounts transactions
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

// Function calculates the closing balance after each recent transaction
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

// Function appends tucstomer account collapse elements
// to main page
appendCustomerAccounts = (accounts) => {
   $('#accounts-collapse-container').append(`<table id="my-bank-accounts-header" class="table table-borderless"><thead class><tr scope="row"><th><span class="display-4">My Bank Accounts</span></th></tr></thead></table><div id="accordion"></div>`);
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

// Function appends the transactions for each customer account
// to a table in the account collapse element
appendCustomerAccountsTransactions = (accounts) => {
   for (i in accounts) {
      accounts[i].Transactions.reverse();
   }

   for (i in accounts) {
      $("#account-" + i + "-body").append(`<table class="table table-striped table-bordered"><thead class="thead-dark"><tr><th scope="row" colspan="4">My Account Details</th></tr><tr><th scope="col">Account Type</th><th scope="col">IBAN</th><th scope="col">BIC</th></tr></thead><tbody><tr scope="row"><td>${accounts[i].AccountType}</td><td>${accounts[i].IBAN}</td><td>${accounts[i].BIC}</td></tr></tbody></table>${(accounts[i].Transactions.length > 0 ? `<table class="table table-striped table-bordered" width=80% id="table${i}" padding=1><thead class="thead-dark"><tr><th scope="row" colspan="4">My Recent Transactions</th></tr><tr><th scope="col">Date</th><th scope="col">Description</th><th scope="col">Amount</th><th scope="col">Balance</th><tr></thead><tbody id="table${i}-body"></tbody></table>` : `<table class="table table-borderless><thead><tr scope="row><th class="h4">There isn't any transactions on this account</th></tr></thead></table>`)}`);
      $("#account-" + i + "-body").append(`${(accounts[i].Transactions.length > 0 ? `<div class="btn-group" style=float:right; margin:10 role="group" aria-label="account-options"><div id=account-buttons>
         <button type="button" id=${accounts[i].AccountID}-statements-btn class="btn btn-secondary">View Statements</button>
         <button type="button" id=${accounts[i].AccountID}-transactions-btn class="btn btn-secondary">View All Transactions</button>
      </div></div><br>`: ``)}`);
      for (j in accounts[i].Transactions) {
         if (j < 25 && accounts[i].Transactions.length > 0) { //number of recent transactions to show
            $('#table' + i + "-body").append(`<tr scope="row"><td>${formatDate(accounts[i].Transactions[j].Date)}</td><td>${accounts[i].Transactions[j].Description}</td><td>${accounts[i].Transactions[j].Type == "Debit" ? "-" + parseFloat(accounts[i].Transactions[j].Amount).toFixed(2) : parseFloat(accounts[i].Transactions[j].Amount).toFixed(2)}</td ><td>${accounts[i].Transactions[j].ClosingBalance.toFixed(2)}</td></tr > `);
         }
      }

   }
   bindCustomerAccountButtonFunctions(accounts);
}

// Function that appends the quick transfer form
// to the page
appendQuickTransferForm = () => {
   $('#my-bank-accounts-header').append(`<div><table id="quick-transfer-table" class="table table-bordered"><thead><tr scope="row"><th><h5 class="h5">Quick Transfer</h5></th><th></th><th></th></tr></thead><td colspan="2"><form id="transfer-form" style="border:black 1px;" class="form-inline"><div class="form-group"><select id='account-from-dropdown' class="form-control" style="margin-right:25px;"></select></div><div class="form-group"><select id='account-to-dropdown' disabled class="form-control" style="margin-right:25px;"></select></div><div class="form-group"><input type="text" id=transfer-amount class="form-control" placeholder="Amount" disabled style="margin-right:25px;"><button type="submit" id="submit-transfer-btn" class="btn btn-primary"><span class="h6">Transfer</span><i style="margin-left:5px; margin-top:5px;" class="fas fa-arrow-circle-right"></i></button></div></form></td><td></td></table></div>`);
   $('#account-from-dropdown').append(`<option value=From_account>From account...</option>`);
   $('#account-to-dropdown').append(`<option value=to_account>To account...</option>`);
}

// Function handles all functionality for the quick transfer form,
// also appends account and payee information to dropdowns in transfer form.
handleTransferForm = (accountsAndTransactions, session_customer_id) => {
   let date = transactionDateAndTime();
   let isPayee = false;
   let from_account_id, to_account_id, amount;
   $('#account-from-dropdown').change(() => {
      $('#account-to-dropdown')
         .find('option')
         .remove()
         .end()
         .append('<option>To Account...</option>')
         .val('To account....');
      ;
      $('#transfer-amount').attr('disabled', true);

      from_account_id = $('#account-from-dropdown').val();
      for (i in accountsAndTransactions) {
         if (accountsAndTransactions[i].AccountID !== from_account_id)
            $('#account-to-dropdown').append(`<option value=${accountsAndTransactions[i].AccountID}>${accountsAndTransactions[i].AccountType} Account ~${accountsAndTransactions[i].IBAN.substr(16)}</option>`);
      }
      $.getJSON(`../php/getPayees.php?customerID=${session_customer_id}`, (data) => {
         for (i in data.Payees) {
            $('#account-to-dropdown').append(`<option value="true"}>Payee - ${data.Payees[i].Name} ~${data.Payees[i].IBAN.substr(16)}</option>`);
         }
      });
      $('#account-to-dropdown').attr('disabled', false);
      $('#account-to-dropdown').change(() => {
         $('#transfer-amount').attr('disabled', false);
         to_account_id = $('#account-to-dropdown').val();
         if (to_account_id === true) {
            isPayee = true;
         }
      })

   })
   $('#submit-transfer-btn').click(() => {
      if ($('#transfer-amount').val() == null || $('#transfer-amount').val().length < 1) {

      }
      else {
         amount = $('#transfer-amount').val();
         if (checkTransfer(accountsAndTransactions, from_account_id, amount) === true) {

            submitTransfer(date, from_account_id, to_account_id, amount, isPayee);
         }
         else {
            console.log('insufficient funds');
         }
      }

   })

}

// Validate the transfer
checkTransfer = (accountsAndTransactions, from_account_id, amount) => {
   console.log(from_account_id, amount)
   for (i in accountsAndTransactions) {
      if (accountsAndTransactions[i].AccountID === from_account_id) {
         if (parseFloat(accountsAndTransactions[i].CurrentBalance) >= parseFloat(amount)) {
            return true;

         }
      }
   }
   return false;
}

// Submit the transfer to the database
submitTransfer = (date, from_account_id, to_account_id, amount, isPayee) => {
   $.getJSON(`../php/handleTransfer.php?date=${date}&from_account=${from_account_id}&to_account=${to_account_id}&amount=${amount}&isPayee=${isPayee}`)
      .done((data, status) => {
         console.log(status);
      })
      .fail(() => {
         console.log('failed to transfer');
      })
}

// Function that binds the customers accounts
// to the quick transfer form at the top of the page.
bindAccountsToQuickTransferForm = (accountsAndTransactions) => {

   for (i in accountsAndTransactions) {
      $('#account-from-dropdown').append(`<option value=${accountsAndTransactions[i].AccountID}>${accountsAndTransactions[i].AccountType} Account ~${accountsAndTransactions[i].IBAN.substr(16)}</option>`);
   }
}

// Function that binds functionality to onclick
// event of buttons located under the recent transactions
// table in each account collapse element.
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

// Function that defines behaviour of buttons
// tied to account transactions,
// located under the recent transactions table in each account
// collapse element
appendRedirectInstructions = (button_id, accounts) => {
   for (i in accounts) {
      if (button_id === accounts[i].AccountID + "-statements-btn") {
         console.log(accounts[i].AccountID + " statements");
      }
      if (button_id === accounts[i].AccountID + "-transactions-btn") {
         console.log(accounts[i].AccountID + " transactions");
         sessionStorage.setItem("AccountID", accounts[i].AccountID);
         window.location.href = 'transactions.html';
      }
   }
}