$("document").ready(function () {
    // If a customer is not logged in <- if the customerID cookie exists
    // hide page content and redirect to login page
    redirectToLoginIfCustomerCookieNotSet();
    setActiveNavLink();
    handleLogout();

    //Analytics
    const session_customer_id = Cookies.get('customerID');
    getPageData(session_customer_id); // -> pass session_customer_id to return and display all page data for customer
})

// Function displays all data on page
getPageData = (session_customer_id) => {
    appendAccountDetails(session_customer_id);
}

appendAccountDetails = (session_customer_id) => {
    $.getJSON(`../php/getCustomerAccounts.php?customerID=${session_customer_id}`)
        .done((data) => {
            let accounts = [];
            let transactions = [];
            let accountsAndTransactions = [];
            if (data.CustomerAccounts === undefined || data.CustomerAccounts.length < 1) {
                console.log("There are no accounts for this customer");
            }
            else {
                accounts = data.CustomerAccounts;
                console.log("customer accounts ", accounts);
                $.getJSON(`../php/getAccountsTransactions.php?customerID=${session_customer_id}`)
                    .done((data) => {
                        if (data.accountTransactions === undefined || data.accountTransactions.length < 1) {
                            console.log("There are no transactions for these accounts")
                        }
                        else {
                            transactions = data.accountTransactions;
                            console.log('account transactions', transactions);
                            accountsAndTransactions = combineAccountsAndTransactions(accounts, transactions);
                            console.log(accountsAndTransactions);
                            displayAccounts(accountsAndTransactions);
                        }
                    })
                    .fail(() => {

                    });
            }

        })
        .fail(() => {
            console.log('failed database connection');
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
    dataToReturn = sortAccountsAndTransactions(dataToReturn);
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

displayAccounts = (accountTransactions) => {
    for (i in accountTransactions) {
        $('#customer-accounts-list-group').append(`<a class="list-group-item list-group-item-action" id="account${i}-list-item" data-toggle="list" href="#" role="tab" aria-controls="home"><h3 class="h3">${accountTransactions[i].AccountType} Account ~${accountTransactions[i].IBAN.substr(16)} Balance: &euro;${accountTransactions[i].CurrentBalance} </h3></a>`)
    }
    bindAccountSelectFunctionality(accountTransactions);
}

bindAccountSelectFunctionality = (account) => {
    let account_buttons = $('#customer-accounts-list-group a');
    console.log(account_buttons);
    for (let i = 0; i < account_buttons.length; i++) {
        let button = account_buttons[i];
        let account_id = account[i].AccountID
        button.onclick = () => {
            handleAccountSelect(account_id);
        };
    }
}


handleAccountSelect = (account_id) => {
    console.log(account_id);
}
