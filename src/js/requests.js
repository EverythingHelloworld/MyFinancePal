var requestData;

$("document").ready(() => {
    //Redirect to login page if cookie isn't set (global function)
    checkAdminCookie();
    handleLogout();
    getRequests();
    handleAdminHomepageClick();
})

//On click handler for logout button
handleLogout = () => {
    $("#btnAdminLogout").on('click', () => {
        clearAdminCookie();
        window.location.href = "login.html";
    })
}

//Removes admin cookie
clearAdminCookie = () => {
    document.cookie = "adminID=''; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

//Gets open requests from db
function getRequests() {
    $.getJSON(`../php/getRequests.php`)
      .done((data) => {
        requestData = data;
        /*If there are open requests, add them to the table and 
        set handlers for approve buttons, else show info message*/
        if(data.Requests.length > 0){
            addRequestsToTable();
            setButtonClicks();
        }else{
            $('#adminHomepageDiv').after('<br><div id=infoMessage class="alert alert-info text-center"' +
            ' role=alert>There are no open requests.</div>');
        }
    })
    .fail(() => {
        console.log("Failed to connect to database");    
    })
}

//Adds requests to table
function addRequestsToTable() {
    $('#adminHomepageDiv').after('<div><br><table class="table table-striped table-bordered" id="requestsTable"><thead class="thead-dark"><tr><th ' +
    'scope="row" colspan="4" class="text-center" style="font-size:30;font-weight:bold;">Account Closure Requests</th></tr><tr><th scope="col">Request ID</th>' +
    '<th scope="col">Customer ID</th><th scope="col">Customer Name</th><th scope="col">Request</th></tr></thead><tbody id="tableBody"></tbody></table></div>');
    for (var i = 0; i < requestData.Requests.length; i++) {
        $('#tableBody').append(`<tr scope="row"><td class="align-middle">${requestData.Requests[i].requestID}</td><td class="align-middle">${requestData.Requests[i].CustomerID}</td><td class="align-middle">${requestData.Requests[i].Name}</td>` + 
        `<td class="align-middle"> <button type="button" class="btn btn-success btn-block" id="btnApprove${i}" value=${requestData.Requests[i].CustomerID}>Approve</button></td></tr>`);
    }
}

//Sets on click handlers for approve buttons
function setButtonClicks(){
    for(var i = 0; i < requestData.Requests.length; i++){
        /*For each request in the table, set the approve button click handler.
        Button ids are in the following format: 'btnApprove[rowNum]'*/
        $(`#btnApprove${i}`).click(function(event){ 
            //event.target.id is the button id  
            handleApproveButtonClick(event.target.id);
        })
    }
}

//Changes the AccountActive field in the db to false to approve closure request
handleApproveButtonClick = (btnID) => {
    //Request id is set as the button value. $(`#${btnID}`).val() gets this value to send it with the request.
    $.post("../php/approveRequest.php", { 'customerID': $(`#${btnID}`).val() });
    //Reload page
    location.reload();
}

//Redirect to admin page if admin homepage button clicked.
handleAdminHomepageClick = () => {
    $("#btnAdminHome").on('click', () => {
        window.location.href = "admin.html";
    })
}

