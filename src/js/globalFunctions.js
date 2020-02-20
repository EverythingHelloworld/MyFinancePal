$("document").ready(function () {
 })

 /*Functions on this page can be accessed from any other html page by importing the script 
 for this page into the html and calling the function on the associated javascript page*/

 //Sets the active link on the nav bar
 function setActiveNavLink(){
     //Get url of page, in format: /MyFinancePal/...
     var pathname = window.location.pathname;
     
     //loop through all nav links
     $('ul > li > a').filter(function() {
         /*href is in format http://localhost.. substring removes http://localhost... 
         from the link so it starts at /MyFinancePal.. and matches the pathname*/
         return this.href.substring(16) === pathname;
     }).addClass('active');
     //^If this function returns true for a link set that link to active
 }