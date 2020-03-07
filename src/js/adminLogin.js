$("document").ready(() => {
  handleLogin();
});


handleLogin = () => {
  $("#btnCancel").on('click', () => {
    window.location.href = 'login.html'
  })

  $("#btnAdminLogin").on('click', () => {
    // this.disabled = true;
    let adminID = $('#inputAdminID').val();
    let password = $('#inputAdminPassword').val();

    if(adminID === '' || password === '')
    {
      $('#adminPassword').before('<div id=errorMessage></div>');
      $('#errorMessage').attr('class', 'col-sm-12 alert alert-danger text-center');
      $('#errorMessage').attr('role', 'alert');
      $('#errorMessage').text('All fields required.');
    }
    else
    getAdminDetails(adminID, password);
  })
}

getAdminDetails = (id, password) => {
  $.getJSON(`../php/getAdminDetails.php?adminID=${id}`)
    .done((data) => {
      let admin = data.AdminDetails[0];
      if (password === admin.Password) {
        Cookies.set('adminID', JSON.stringify(admin.AdminID));
        console.log("AdminID = " + Cookies.get('adminID'));
        window.location.href = "admin.html";
      }
    })
    .fail(() => {
      console.log("failed");
      $('#adminPassword').before('<div id=errorMessage></div>');
      $('#errorMessage').attr('class', 'col-sm-12 alert alert-danger text-center');
      $('#errorMessage').attr('role', 'alert');
      $('#errorMessage').text('Incorrect Login details');
    })

}//close handleLogin





