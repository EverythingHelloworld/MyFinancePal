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

