$("document").ready(() => {
  if (Cookies.get('adminID') === undefined) {
    $("#jumbotron").attr('style', 'display:none');
    $("#navbar").attr('style', 'display:none');
    $("#btnDiv").attr('style', 'display:none');
    window.location.href = 'login.html';

  }
  console.log(Cookies.get('adminID'));
  $('#btnDiv').append(`<button type="button" class="btn btn-primary" id="btnAdminLogout">Log out</button>`);
  loadListBoxValues();
  handleLogout();

  $("#btnUnlock").click(function() {
  if($("#accLockedList option:selected").index() === 0)
  {
    console.log("Cant use first option");
  }
  else
  {
    resetLoginAttempts($("#accLockedList").val());
    unlockAccount($("#accLockedList").val());
    location.reload();
  }
});

$("#btnLock").click(function() {
  if($("#accUnlockedList option:selected").index() === 0)
  {
    console.log("Cant use first option");
  }
  else
  {
    lockAccount($("#accUnlockedList").val());
    location.reload();
  }
});
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

function loadListBoxValues()
{
  var unlockedList = $("#accUnlockedList");
  var lockedList = $("#accLockedList");

  $.getJSON(`../php/getAccounts.php`)
    .done((data) => {

      for(var i=0;i<data.account.length;i++)
      {
        if(data.account[i].Locked == 1)
        lockedList.append(`<option>${data.account[i].ID}</option>`)
        else
        unlockedList.append(`<option>${data.account[i].ID}</option>`)
      }
      
    })
    .fail(() => {
      console.log("failed");
      
    })
}