$("document").ready(() => {
  checkAdminCookie();
  loadListBoxValues();
  handleLockAccountClick();
  handleUnlockAccountClick();
  handleLogout();
  setNoRequests();
  handleRequestsClick();
})

function loadListBoxValues() {
  var unlockedList = $("#accUnlockedList");
  var lockedList = $("#accLockedList");

  $.getJSON(`../php/getAccounts.php`)
    .done((data) => {

      for(var i=0;i<data.account.length;i++){
        if(data.account[i].Locked == 1)
          lockedList.append(`<option>${data.account[i].ID}</option>`);
        else
          unlockedList.append(`<option>${data.account[i].ID}</option>`);
      }
     
    })
    .fail(() => {
      console.log("failed");    
    })
}

function handleLockAccountClick() {
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
}

function handleUnlockAccountClick() {
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
}

handleLogout = () => {
  $("#btnAdminLogout").on('click', () => {
    clearAdminCookie();
    window.location.href = "login.html";
  })
}

clearAdminCookie = () => {
  document.cookie = "adminID=''; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

//Adds number of open requests to requests badge
function setNoRequests() {
  $.getJSON(`../php/getRequests.php`)
    .done((data) => {
     $('#requestNum').text(data.Requests.length);
    })
    .fail(() => {
      console.log("failed");    
    })
}

function handleRequestsClick() {
  $("#btnRequests").click(function() {
    window.location.href = "../html/requests.html";
  });
}

