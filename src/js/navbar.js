$("document").ready(function () {
                $("#navbar").html(`<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" 
                aria-controls="#navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
                  <ul class="nav navbar-nav nav-fill" id='list' style='width:100%'>
                        <li class='nav-item'><a class='nav-link' href='../html/main.html' class='external' 
                                                style='color:rgba(255,255,255,.5);'>Home</a>
                        </li>
                        <li class='nav-item'>
                                <a class='nav-link' href='../html/analytics.html' class='external' 
                                style='color:rgba(255,255,255,.5);'>Analytics</a>
                        </li>
                        <li class='nav-item'>
                                <a class='nav-link' href='../html/managePayees.html' class='external' 
                                style='color:rgba(255,255,255,.5);'>Payees</a>
                        </li>
                        <li class='nav-item'>
                                <a class='nav-link' href='../html/loan.html' class='external' 
                                style='color:rgba(255,255,255,.5);'>Loan</a>
                        </li>
                        <li class='nav-item'>
                                <a class='nav-link' id='btnLogout' href='#' class='external' 
                                style='color:rgba(255,255,255,.5);'>Logout</a>
                        </li>
                  </ul>
                </div>
              </nav>`);

        // handleLogout has to be binded to the onclick event here
        // don't change this
        $('#btnLogout').onclick = handleLogout();
})