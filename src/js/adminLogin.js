$("document").ready(() => {
  handleLogin();
});

handleLogin = () => {
  $("#btnAdminLogin").on('click', () => {
    // this.disabled = true;
    console.log("test");
    let adminID = $('#inputAdminID').val();
    let password = $('#inputAdminPassword').val();
    console.log("ID:", adminID);
    console.log("Password:", password);
    getAdminDetails(adminID, password);
  })
}

getAdminDetails = (id, password) => {
  $.getJSON(`../php/getAdminDetails.php?adminID=${id}`)
    .done((data) => {
      let admin = data.AdminDetails[0];
      if (password === admin.Password) {
        document.cookie = `Admin=${admin.AdminID}; path=/`;
        window.location.href = "admin.html";
      }
      console.log(admin);
    })
    .fail(() => {
      console.log("fail");
    })

}//close handleLogin