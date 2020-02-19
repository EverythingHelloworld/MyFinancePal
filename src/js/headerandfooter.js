$("document").ready(function(){
    $("#header").html("<div class='jumbotron jumbotron-fluid'><div class='container'><h1 class='display-4' style='text-align:center;'>" +
    "My Finance Pal</h1></div></div><nav class='navbar navbar-expand-lg navbar-dark bg-dark' style='list-style-type:none !important;'>" +
    "<button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarTogglerDemo01'" +
    "aria-controls='navbarTogglerDemo01' aria-expanded='false' aria-label='Toggle navigation'>" +
    "<span class='navbar-toggler-icon'></span></button>'<div class='collapse navbar-collapse'" +
    "id='navbarTogglerDemo01'><ul class='navbar-nav mr-auto mt-3 mt-lg-0'>" +
    "<li class='nav-item'><a class='nav-link' href='../html/main.html' class='external'>Home</a></li><li class='nav-item'>" +
      "<a class='nav-link' href='../html/analytics.html' class='external'>Analytics</a></li><li class='nav-item'>" +
      "<a class='nav-link' href='../html/transfer.html' class='external'>Transfer</a></li><li class='nav-item'>" +
      "<a class='nav-link' href='../html/applyOnline.html' class='external'>Apply Online</a></li></nav><br/>");
      
      //Change links in header depending on whether or not admin is logged in
      // if(typeof document.cookie !== undefined && document.cookie !== ""){
      //   $("#header").append("| <a href=admin.html>Admin</a> | <a id=logout href=logout.html>Logout</a>");
      // }else{
      //   $("#header").append("| <a href=login.html>Login</a>");
      // }
      
    $("#footer").html("Footer here");
})