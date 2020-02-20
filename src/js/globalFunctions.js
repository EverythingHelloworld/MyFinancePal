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

//Returns reformated transaction date
//YYYY-MM-DD -> DD-MM-YYYY
//don't ask why
formatDate = (date) => {
    console.log(date);
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