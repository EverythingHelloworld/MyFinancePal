$("document").ready(() => {
  // checkValidAdmin();
  handleLogout();
})

handleLogout = () => {
  $("#btnAdminLogout").on('click', () => {
    console.log('test');
    window.location.href = "login.html";
  })
  clearAdminCookie();
}

checkValidAdmin = () => {
  let adminCookie;
  console.log(adminCookie);
}

clearAdminCookie = () => {

}