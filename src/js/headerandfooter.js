$("document").ready(function(){
    $("#header").html("Header here");
      
      //Change links in header depending on whether or not admin is logged in
      // if(typeof document.cookie !== undefined && document.cookie !== ""){
      //   $("#header").append("| <a href=admin.html>Admin</a> | <a id=logout href=logout.html>Logout</a>");
      // }else{
      //   $("#header").append("| <a href=login.html>Login</a>");
      // }
      
    $("#footer").html("Footer here");
})

