$("document").ready(() => {
    if (Cookies.get('adminID') === undefined) {
        $("#jumbotron").attr('style', 'display:none');
        $("#navbar").attr('style', 'display:none');
        $("#btnDiv").attr('style', 'display:none');
        window.location.href = 'login.html';
    }
})