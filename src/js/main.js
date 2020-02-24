$("document").ready(() => {

   setActiveNavLink();
   const session_customer_id = Cookies.get('customerID');
   getCustomerData(session_customer_id); // -> pass session_customer_id to return and display all customer data
   handleLogout();
});

//Function
//For current session
//Retrieve all customer transactional information from database [customer accounts and transactions associated to those accounts]
//1. Extract all customer bank accounts -> (data) -> getCustomerAccounts(), returns an array of JSON objects
//2. Extract all transactions and associate them with the correct bank account, returns a nested array of JSON objects
//3. Sort transactions for each account -> calculates and stores the closing balance for an account after each transaction
//4. Append bank account collapse element to main.html
//5. Append all bank account transaction information to associated collapse element in main
getCustomerData = (customer_id) => {
   $.getJSON(`../php/getAccountsTransactions.php?customer_id=${customer_id}`, (data) => {
      console.log(data);
      let customerAccounts = []; //array to store account objects
      customerAccounts = getCustomerAccounts(data);
      console.log(customerAccounts);
      sortCustomerAccountTransactions(customerAccounts);
      appendCustomerAccounts(customerAccounts);
      appendCustomerAccountsTransactions(customerAccounts);
   });
}

//Extract all customer bank accounts
//This creates an array of each account the customer has 
getCustomerAccounts = (data) => {
   let accounts = [];
   //for every  object in data.accountTransactions
   //push only bank account information to the array (Account number, IBAN, opening balance,)
   for (let i in data.accountTransactions) {
      accounts.push({ "AccountID": data.accountTransactions[i].AccountID, "IBAN": data.accountTransactions[i].IBAN, "OpeningBalance": data.accountTransactions[i].OpeningBalance, "CurrentBalance": data.accountTransactions[i].CurrentBalance, "Transactions": [] });
   }
   accounts = _.uniq(accounts, (x) => { return parseInt(x.AccountID) });
   for (i in accounts) {
      //console.log(accounts[i]);
      for (j in data.accountTransactions) {
         if (accounts[i].AccountID == data.accountTransactions[j].AccountID) {
            accounts[i].Transactions.push({
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
   return accounts;
}


sortCustomerAccountTransactions = (accountTransactions) => {
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

appendCustomerAccounts = (accounts) => {
   $('#accounts-collapse-container').append(`<div id="accordion">   </div>`);
   for (i in accounts) {
      $('#accounts-collapse-container').append(`
     <div class="card">
       <div class="card-header" height="100px" id="account-${i}-heading">
         <h5 class="mb-0">
           <button id="btn-collapse-${i}" class="btn btn-link" data-toggle="collapse" data-target="#account-${i}-collapse" aria-expanded="false" aria-controls="account-${i}-collapse">
           <div class="container">
             <div class="row align-items-center">
               <div class="col">
               <i id="btn-collapse-symbol${i}" class="fas fa-plus"></i>
               </div>
             </div>     
           </button>
           <span>~${accounts[i].AccountID}</span>
         </h5>
       </div>
   
       <div id="account-${i}-collapse" class="collapse hide" aria-labelledby="account-${i}-heading" data-parent="#accordion">
         <div id="account-${i}-body" class="card-body">
         </div>
       </div>`);
   }
}

appendCustomerAccountsTransactions = (accounts) => {
   for (i in accounts) {
      accounts[i].Transactions.reverse();
   }

   for (i in accounts) {
      $("#account-" + i + "-body").append(`<table class="table table-striped border" width=80% id="table${i}" padding=1><thead><tr><th scope="col">Date</th><th scope="col">Description</th><th scope="col">Amount</th><th scope="col">Balance</th><tr></thead><tbody id="table${i}-body"></tbody></table>`);
      $("#account-" + i + "-body").append(`<div class="btn-group" style=float:right; margin:10 role="group" aria-label="account-options">
      <div id=account-buttons>
         <button type="button" id=${accounts[i].AccountID}-payee-btn class="btn btn-secondary">Manage Payees</button>
         <button type="button" id=${accounts[i].AccountID}-statements-btn class="btn btn-secondary">View Statements</button>
         <button type="button" id=${accounts[i].AccountID}-transactions-btn class="btn btn-secondary">View All Transactions</button>
      </div>
      </div><br>`);
      for (j in accounts[i].Transactions) {
         if (j < 25) { //number of recent transactions to show
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
         sessionStorage.setItem('AccountID', accounts[i].AccountID);
         sessionStorage.setItem('CustomerID', 1);
         console.log(sessionStorage.getItem('AccountID'));
         window.location.href = "transactionTester.html";
      }
   }
}

handleLogout = () => {
   $("#btnLogout").click(function () {
      Cookies.remove('customerID');
      console.log(Cookies.get('customerID') + '<- cookie here');
      window.location.href = "login.html";
   })
}

