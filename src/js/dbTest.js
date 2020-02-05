$("document").ready(function() 
{
    // Insert Fields + Button

    var iName = $("#iName");
    var iDOB = $("#iDOB");
    var iCity = $("#iCity");
    var iStreet = $("#iStreet");
    var iPostCode = $("#iPostCode");

    // Update Fields + Button

    var uName = $("#uName");
    var uDOB = $("#uDOB");
    var uCity = $("#uCity");
    var uStreet = $("#uStreet");
    var uPostCode = $("#uPostCode");
    var uId = $("#uId");

    // Retrieve Fields

    var id = $("#id");

    //Clicking Update Button

    $("#Update").click(function() 
    {
        $("#data").empty();

        $.getJSON(`php/updateCustomer.php?id=${uId.val()}&name=${uName.val()}&dob=${uDOB.val()}&city=${uCity.val()}&street=${uStreet.val()}&postcode=${uPostCode.val()}`, function(data)
        { 
        });

        uName.val('');
        uDOB.val('');
        uCity.val('');
        uStreet.val('');
        uPostCode.val('');
        uId.val('');

    });

    //Clicking Insert Button

    $("#Insert").click(function() 
    {
        $("#data").empty();

        $.getJSON(`php/insertCustomer.php?name=${iName.val()}&dob=${iDOB.val()}&city=${iCity.val()}&street=${iStreet.val()}&postcode=${iPostCode.val()}`, function(data)
        { 
        });

        iName.val('');
        iDOB.val('');
        iCity.val('');
        iStreet.val('');
        iPostCode.val('');
           
    });

    //Clicking Retrieve Button

    $("#Retrieve").click(function() 
    {
        $("#data").empty();

           $.getJSON(`php/getCustomer.php?id=${id.val()}`, function(data)
           {
               for(var i=0;i<data.customer.length;i++)
               {
                   $("#data").empty();
                   $("#data").append(`<br>${data.customer[i].Name}`);
                   $("#data").append(`<br>${data.customer[i].DOB}`);
                   $("#data").append(`<br>${data.customer[i].City}`);
                   $("#data").append(`<br>${data.customer[i].Street}`);
                   $("#data").append(`<br>${data.customer[i].PostCode}`);
               }
           });

    });



});
