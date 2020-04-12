$("document").ready(() => {
  $('#footer').append(`
  
  <footer style= "margin-top:300;" border-top: class="page-footer font-small mdb-color lighten-3 pt-4 bg-dark">

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<style>
.fa {
  padding: 20px;
  font-size: 30px;
  width: 70px;
  text-align: center;
  text-decoration: none;
  margin: 5px 2px;
  border-radius: 50%;
}
.fa:hover {
    opacity: 0.7;
}
.fa-facebook {
  background: #3B5998;
  color: white;
}
.fa-twitter {
  background: #55ACEE;
  color: white;
}
</style>

    <div class="container text-center text-md-left">
  
      <div class="row">
  
  
        <hr class="clearfix w-100 d-md-none">
  
        <hr class="clearfix w-100 d-md-none">
  
        <div class="col-md-4 col-lg-3 mx-auto my-md-4 my-0 mt-4 mb-1 " style='color:rgba(255,255,255,.5);'>
  
          <h5 class="font-weight-bold text-uppercase mb-4">Address</h5>
  
          <ul class="list-unstyled">
            <li>
              <p>
                <i class="fas fa-home mr-3" ></i>Letterkenny, Co. Donegal</p>
            </li>
            <li>
              <p>
                <i class="fas fa-envelope mr-3"></i> myfinancepal@hotmail.com</p>
            </li>
            <li>
              <p>
                <i class="fas fa-phone mr-3"></i> +353 86 123 1234</p>
            </li>
          </ul>
        </div>

  
        <div class="col-md-2 col-lg-2 text-center mx-auto my-4" style='color:rgba(255,255,255,.5);'>

        <h5 class="font-weight-bold text-uppercase mb-4">FOLLOW US</h5>
          <a href="https://www.facebook.com/UlsterBank/" class="fa fa-facebook"></a>
          <a href="https://twitter.com/UlsterBank" class="fa fa-twitter"></a>
  
        </div>
      </div>

  
    </div>
      <div class="footer-copyright text-center py-3" style='color:rgba(255,255,255,.5);'>&copy; 2020 Copyright:
      <a href="https://digital.ulsterbank.ie/"> MyFinancePal.com</a>
    </div>
  
  </footer>`);
});