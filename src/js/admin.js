$("document").ready(() => {
  if (Cookies.get('adminID') === undefined) {
    $("#jumbotron").attr('style', 'display:none');
    $("#navbar").attr('style', 'display:none');
    $("#btnDiv").attr('style', 'display:none');
    window.location.href = 'login.html';

  }
  console.log(Cookies.get('adminID'));
  $('#btnDiv').append(`<button type="button" class="btn btn-primary" id="btnAdminLogout">Log out</button>`);
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