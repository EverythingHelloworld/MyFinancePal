$("document").ready(() => {
  handleLogin();
})

handleLogin = () => {
  $("#btnLogin").click(() => {
    this.disabled = true;
    var adminID = $('#inputID').val();
    var password = $('#inputPassword').val();
    getAdminDetails(adminID, password);
  })

  getAdminDetails = (id, password) => {
    $.getJSON(`../php/getAdminDetails.php?AdminID=${id}`, (data) => {
      console.log(data);
      var Admin = data.AdminDetails[0];
      if (password === Admin.Password) {
        document.cookie = `AdminID=${Admin.AdminID}; path=/`;
        window.location.href = "admin.html";
      } else {
        //Add error message to div
        console.log('incorrect login details');
      }
    });
  }
}//close handleLogin