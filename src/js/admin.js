$("document").ready(() => {
  handleLogout();
})

handleLogout = () => {
  $("#btnAdminLogout").on('click', () => {
    clearAdminCookie();
    window.location.href = "login.html";
  })

}

clearAdminCookie = () => {
  document.cookie = "adminID=''; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  console.log(Cookies.get('adminID') + '<- cookie here');

}