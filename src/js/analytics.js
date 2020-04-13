var selectedChart = "1";
var totalExpenditure;
var totalIncome;
var selectedAccountData;
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

            }
            else {
                accounts = data.CustomerAccounts;
                $.getJSON(`../php/getAccountsTransactions.php?customerID=${session_customer_id}`)
                    .done((data) => {
                        if (data.accountTransactions === undefined) {
                        }
                        else {
                            transactions = data.accountTransactions;
                            accountsAndTransactions = combineAccountsAndTransactions(accounts, transactions);
                            displayAccounts(accountsAndTransactions);
                        }
                    })
                    .fail(() => {
                        alert("Error: Failed to connect to database\nYou will be logged out");
                        window.location.href = "login.html";
                        Cookies.remove('customerID');
                        Cookies.remove('loggedIn');
                        sessionStorage.clear();
                    });
            }

        })
        .fail(() => {
            alert("Error: Failed to connect to database\nYou Will be logged out");
            window.location.href = "login.html";
            Cookies.remove('customerID');
            Cookies.remove('loggedIn');
            sessionStorage.clear();
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

bindAccountSelectFunctionality = (accountTransactions) => {
    let account_buttons = $('#customer-accounts-list-group a');
    for (let i = 0; i < account_buttons.length; i++) {
        let button = account_buttons[i];
        button.onclick = () => {
            handleAccountSelect(accountTransactions[i]);
        };
    }
}

//Handler which is called when an account is selected
handleAccountSelect = (accountData) => {
    $('#error-message').empty();
    $("#graph-container").empty();
    //Set global account data variable. Used for chart dropdown.
    selectedAccountData = accountData;
    if (accountData.Transactions.length === 0) {
        $('#select-container').attr('style', 'display:none');
        $('#analytics-title').attr('style', 'display:none');
        $('#error-message').append(`<div class="alert alert-info" role="alert">There doesn't appear to be any transactions for this account yet</div>`);
    }
    else {
        //Make analytics title and chart dropdown visible
        $('#select-container').attr('style', 'display:block');
        $('#analytics-title').attr('style', 'display:block');
        //Display selected chart
        displayAccountAnalytics(accountData);
    }
}

displayAccountAnalytics = (accountData) => {
    //Clear the chart container if there is a chart on screen

    //Calls handler for selected chart
    if (selectedChart === "1") {
        displayIncExpChart(accountData);
    } else if (selectedChart === "2") {
        //Show exp by category chart
        displayCategoryChart(accountData);
    } else if (selectedChart === "3") {
        //Show exp by merchant chart
        displayMerchantChart(accountData);
        //NOTE: Parse the transaction amounts to floats when doing calculations
    }
}

//Changes the chart when the dropdown is changed
function handleChartDropdownChange() {
    $("#chart-select").on('change', () => {
        selectedChart = $('#chart-select').val();
        displayAccountAnalytics(selectedAccountData);
    })
}

function displayIncExpChart(accountData) {
    let symbol = '\u20AC';
    //Calculate income and expenditure 
    calculateIncExp(accountData);

    //Sets chart options
    var options = {
        title: {
            text: "Income vs. Expenditure"
        },
        data: [{
            type: "pie",
            startAngle: 45,
            showInLegend: "true",
            legendText: "{label}",
            indexLabel: "{label} ({y})",
            yValueFormatString: `${symbol}#,###.##`,
            dataPoints: [
                { label: "Income ", y: totalIncome },
                { label: "Expenditure ", y: totalExpenditure },
            ]
        }]
    };
    //Creates chart with those options
    $("#graph-container").CanvasJSChart(options);
}

//Calculates income and expenditure
function calculateIncExp(accountData) {
    totalExpenditure = 0;
    totalIncome = 0;
    totalIncome = parseFloat(accountData.OpeningBalance);
    totalExpenditure = 0;
    //Loop through transactions
    for (var i = 0; i < accountData.Transactions.length; i++) {
        //If credit add to income, if debit add to expenditure
        if (accountData.Transactions[i].Type === "Credit") {
            totalIncome = totalIncome + parseFloat(accountData.Transactions[i].Amount);
        }
        else {
            totalExpenditure = totalExpenditure + parseFloat(accountData.Transactions[i].Amount);
        }
    }
}


displayCategoryChart = (accountData) => {
    let data = getCategoryData(accountData);
    let symbol = '\u20AC';
    let chartData = [];
    for (i in data) {
        chartData.push({ "y": data[i].amount, "label": data[i].category });
    }
    //Sets chart options
    let options = {
        title: {
            text: "Categories",
            fontFamily: "Impact",
            fontWeight: "normal"
        },
        data: [{
            showInLegend: "true",
            legendText: "{label}",
            yValueFormatString: `${symbol}#,###.##`,
            type: "doughnut",
            dataPoints: chartData
        }]
    };
    //Creates chart with those options
    $("#graph-container").CanvasJSChart(options);
}

getCategoryData = (accountData) => {
    let data = [];
    let temp = [];
    let amount;
    for (i in accountData.Transactions) {
        if (!(accountData.Transactions[i].Category === "Income"))
            temp.push(accountData.Transactions[i].Category);
    }
    temp = _.uniq(temp);
    for (i in temp) {
        amount = 0;
        for (j in accountData.Transactions) {
            if (temp[i] === accountData.Transactions[j].Category) {
                amount += parseFloat(accountData.Transactions[j].Amount);
            }
        }
        data.push({ "category": temp[i], "amount": amount.toFixed(2) });
    }
    return data;
}

displayMerchantChart = (accountData) => {
    let data = getMerchantData(accountData);
    let symbol = '\u20AC';
    let chartData = [];
    let count = 1;
    for (i in data) {
        chartData.push({ "y": parseFloat(data[i].amount), "label": data[i].merchant });
    }
    //Sets chart options
    let options = {
        title: {
            text: "Merchants",
            fontFamily: "Impact",
            fontWeight: "normal"
        },
        data: [{
            showInLegend: "true",
            legendText: "{label}",
            yValueFormatString: `${symbol}#,###.##`,
            type: "pyramid",
            dataPoints: chartData
        }]
    };
    //Creates chart with those options
    $("#graph-container").CanvasJSChart(options);
}

getMerchantData = (accountData) => {
    let data = [];
    let temp = [];
    let amount;
    _.sortBy(accountData.Tran, function (num) { return num; });

    for (i in accountData.Transactions) {
        if (accountData.Transactions[i].Type === "Debit")
            temp.push(accountData.Transactions[i].Description);
    }
    temp = _.uniq(temp);
    for (i in temp) {
        amount = 0;
        for (j in accountData.Transactions) {
            if (temp[i] === accountData.Transactions[j].Description) {
                amount += parseFloat(accountData.Transactions[j].Amount);
            }
        }
        data.push({ "merchant": temp[i], "amount": amount.toFixed(2) });
    }
    data.sort(function (a, b) {
        return b.amount - a.amount;
    });

    if (data.length > 10) {
        var topTen = [];
        for (var i = 0; i < 10; i++) {
            topTen.push(data[i]);
        }
        return topTen;
    }
    else
        return data;
}