$("document").ready(function () {
})

/*Functions on this page can be accessed from any other html page by importing the script 
for this page into the html and calling the function on the associated javascript page*/

//Sets the active link on the nav bar
function setActiveNavLink() {
    //Get url of page, in format: /MyFinancePal/...
    var pathname = window.location.pathname;

    //loop through all nav links
    $('ul > li > a').filter(function () {
        /*href is in format http://localhost.. substring removes http://localhost... 
        from the link so it starts at /MyFinancePal.. and matches the pathname*/
        return this.href.substring(16) === pathname;
    }).addClass('active');
    //^If this function returns true for a link set that link to active
}

function redirectToLoginIfCustomerCookieNotSet() {
    if (Cookies.get('loggedIn') === undefined) {
        $('#jumbotron').attr('style', 'display:none');
        $('#navbar').attr('style', 'display:none');
        window.location.href = 'login.html';
    }
}

//Returns reformated transaction date
//YYYY-MM-DD -> DD-MM-YYYY
formatDate = (date) => {
    let day = [], year = [], month = [], new_date = [];
    let d = date.slice(0, 10);
    day.push(d[8], d[9], d[7]);
    month.push(d[05], d[06], d[04]);
    year.push(d[0], d[1], d[2], d[3])
    day = day.join('');
    month = month.join('');
    year = year.join('');
    new_date.push(day, month, year);
    return new_date.join('');
}

//This function logs the customer out when they click the log out button
handleLogout = () => {
    $("#btnLogout").click(function () {
        window.location.href = "login.html";
        Cookies.remove('customerID');
        Cookies.remove('loggedIn');
        sessionStorage.clear();
    })
}

//Generates a random number between the minimum value and max value (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Reset customer login attempts to 0
function resetLoginAttempts(id) {
    $.post("../php/resetLoginAttempts.php", { 'id': id });
}

//increment customer login attempts by 1
function incrementLoginAttempts(id) {
    $.post("../php/incrementLoginAttempts.php", { 'id': id });
}

//Lock customer account
function lockAccount(id) {
    $.post("../php/lockAccount.php", { 'id': id });
}

//Unlock customer account
function unlockAccount(id) {
    $.post("../php/unlockAccount.php", { 'id': id });
}

//Get today's date
function todaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

//Check to make sure admin cookie is set
function checkAdminCookie() {
    if (Cookies.get('adminID') === undefined) {
      $("#jumbotron").attr('style', 'display:none');
      $("#navbar").attr('style', 'display:none');
      $("#btnDiv").attr('style', 'display:none');
      window.location.href = 'login.html';
    }
  }

function transactionDateAndTime() {
    let d = todaysDate(); let x;
    let dateTime = new Date();
    let hours = dateTime.getHours(); let minutes = dateTime.getMinutes(); let seconds = dateTime.getSeconds();
    if (minutes < 10) {
        x = ["0", minutes];
        minutes = x.join('');

    }
    if (seconds < 10) {
        x = ["0", seconds];
        seconds = x.join('');

    }
    let transactionTime = [d, " ", hours, ":", minutes, ":", seconds]
    return transactionTime.join('');

}