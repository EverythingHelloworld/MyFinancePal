$("document").ready(() => {
  handleLogin();
});


handleLogin = () => {
  $("#btnCancel").on('click', () => {
    window.location.href = 'login.html'
  })

  $("#btnAdminLogin").on('click', () => {
    let adminID = $('#inputAdminID').val();
    let password = $('#inputAdminPassword').val();

    if (adminID === '' || password === '') {
      $('#errorMessage').empty();
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
      if (data.AdminDetails === undefined || data.AdminDetails.length < 1) {
        $('#adminPassword').before('<div id=errorMessage></div>');
        $('#errorMessage').empty();
        $('#errorMessage').attr('class', 'col-sm-12 alert alert-danger text-center');
        $('#errorMessage').attr('role', 'alert');
        $('#errorMessage').text('Admin ID is Invalid');
      }
      else {
        let admin = data.AdminDetails[0];
        if (password === admin.Password) {
          Cookies.set('adminID', JSON.stringify(admin.AdminID));
          console.log("AdminID = " + Cookies.get('adminID'));
          window.location.href = "admin.html";
        }
        else {
          $('#adminPassword').before('<div id=errorMessage></div>');
          $('#errorMessage').empty();
          $('#errorMessage').attr('class', 'col-sm-12 alert alert-danger text-center');
          $('#errorMessage').attr('role', 'alert');
          $('#errorMessage').text('Invalid Password');
        }
      }
    })
    .fail(() => {
      $('#adminPassword').before('<div id=errorMessage></div>');
      $('#errorMessage').empty();
      $('#errorMessage').attr('class', 'col-sm-12 alert alert-danger text-center');
      $('#errorMessage').attr('role', 'alert');
      $('#errorMessage').text('Admin ID is Invalid');

    })

}//close handleLogin





