var selectedChart = 1;
var totalExpenditure;
var totalIncome;
$("document").ready(function () {
    // If a customer is not logged in <- if the customerID cookie exists
    // hide page content and redirect to login page
    redirectToLoginIfCustomerCookieNotSet();
    setActiveNavLink();
    handleLogout();
    //Analytics
    const session_customer_id = Cookies.get('customerID');
    getPageData(session_customer_id); // -> pass session_customer_id to return and display all page data for customer
    handleChartDropdownChange();
    // displayAccountAnalytics(accountData)
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
                            accountsAndTransactions = combineAccountsAndTransactions(accounts, transactions);
                            console.log(accountsAndTransactions);
                            displayAccounts(accountsAndTransactions);
                        }
                    })
                    .fail(() => {
                        console.log("failed database connection")
                    });
            }

        })
        .fail(() => {
            console.log("failed database connection");
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
    // $('#account0-list-item').attr('class', 'list-group-item active list-group-item-action' )
    bindAccountSelectFunctionality(accountTransactions);
}

bindAccountSelectFunctionality = (accountTransactions) => {
    let account_buttons = $('#customer-accounts-list-group a');
    for (let i = 0; i < account_buttons.length; i++) {
        let button = account_buttons[i];
        button.onclick = () => {
            handleAccountSelect(accountTransactions[i]);
        };
    }
}


handleAccountSelect = (accountData) => {
    $('#select-container').attr('style', 'display:block');
    $('#analytics-title').attr('style', 'display:block');

    $('#analytics-title').text("My Analytics");
    displayAccountAnalytics(accountData)
}


displayAccountAnalytics = (accountData) => {
    $("#graph-container").empty();
    console.log('selected is: ', selectedChart);
    if(selectedChart === 1){
        displayIncExpChart(accountData);
    }else if (selectedChart === 2){
        //Show exp by category chart
    }else if(selectedChart === 3){
        //Show exp by merchant chart
    }
}

function handleChartDropdownChange(){
    $("#chart-select").on('change', () => {
        selectedChart = $('#chart-select').val();
        console.log('called');
      })
}

function displayIncExpChart(accountData){
    console.log('selected is: ', selectedChart);
    console.log('totalIncome is: ', totalIncome);
    console.log('totalExpenditure is: ', totalExpenditure);
    calculateIncExpPercentages(accountData);
    var options = {
	title: {
		text: "Income vs. Expenditure (in euro)"
	},
	data: [{
			type: "pie",
			startAngle: 45,
			showInLegend: "true",
			legendText: "{label}",
			indexLabel: "{label} ({y})",
			yValueFormatString:"#,##0.#"%"",
			dataPoints: [
				{ label: "Income: ", y: totalIncome },
				{ label: "Expenditure: ", y: totalExpenditure},
			]
	}]
    };
$("#graph-container").CanvasJSChart(options);
}     

function calculateIncExpPercentages(accountData){
    totalExpenditure = 0;
    totalIncome = 0;
    totalIncome = parseFloat(accountData.OpeningBalance);
    totalExpenditure = 0;
    for(var i = 0; i < accountData.Transactions.length; i++){
        if(accountData.Transactions[i].Type === "Credit"){
            totalIncome = totalIncome + parseFloat(accountData.Transactions[i].Amount);
        }
        else{
            totalExpenditure = totalExpenditure + parseFloat(accountData.Transactions[i].Amount);

        }
    }
}


