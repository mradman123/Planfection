$( document ).ready(function() {

	
	//Initialize input mask
    $('#inputContact').inputmask({"mask": "(09[9])-999-999[9]"});
    $("#inputDateofBirth").inputmask("d.m.y.", { "placeholder": "dd.mm.gggg."});

	
    
    
GetLocations();
	
    
});

$("#inputLocation").select2({
            placeholder: "Odaberite lokaciju",
            allowClear: true,
            dropdownAutoWidth: true,
            width: '100%'
        }); 

// Error functions //
    function UserError(data){
        toastr.error(JSON.parse(data.responseText).message);
    }


    var Fill = function (data) {
       /* $("#inputEmail").val(data.email);*/
        $("#inputContact").val(data.phoneNumber);
        $("#inputAddress").val(data.address);
        $("#inputLocation").val(data.location).trigger('change');
        $("#inputDateofBirth").val(data.dateOfBirth);

    }
//Initialize datepicker
    /*$('#inputDateofBirth').datepicker({
		startDate: '-3d',
		format: 'dd.mm.yyyy.',
      	autoclose: true
    });*/

    //GET all locations
    var GetLocations = function () {
            $.ajax({
                type: "GET",
                url: ServerAddress + "/api/getLocations?token=" + JSON.parse(localStorage.getItem('Token')),
                crossDomain: true,
                dataType: 'jsonp',                
                
                success: function (Locations) {
                    GetUser(Fill,UserError);
                   //Add locations to dropdown
                    $.each(Locations, function (i, item) {
                        $('#inputLocation').append($('<option>', {
                            value: item.title,
                            text: item.title
                        }));
                    });
                    
                },
                error: function (passParams) {
                    // code here
                }
            });

        };

$("#save").click(function () {   
            $("#accept-modal").show();      
                
    });



$(".closeModal").click(function () {
        $("#accept-modal").hide(); 
        $("#acceptP-modal").hide();       
    });

$("#submit-user").click(function () { 
        var userId= JSON.parse(localStorage.getItem('User'))._id;
        var data = {
            /*'Email': $("#inputEmail").val(),*/
            'Address': $("#inputAddress").val(),
            'PhoneNumber': $("#inputContact").val(),
            'DateOfBirth': $("#inputDateofBirth").val(),
            'Location': $("#inputLocation").val(),
            'UserId': userId
                   
        };
        $.ajax({
            type: "POST",
            url: ServerAddress + "/api/editUser?token=" + JSON.parse(localStorage.getItem('Token')),
            data: data,
            crossDomain: true,
            dataType: 'json',
            success: function (data, status, jqXHR) {
                $("#accept-modal").hide();
                GetUser(Fill,UserError);
                toastr.success(data.message);
            },
            error: function (data, status) {
                $("#accept-modal").hide();
                toastr.error(JSON.parse(data.responseText).message);
            }
        });
    });




 // VALIDATION //
    $('#change-password-form').parsley();

$('#saveP').click(function (e) {
        $('#change-password-form').parsley().validate();
        if ($('#change-password-form').parsley().isValid()) {
            $('#acceptP-modal').modal('show');          
        }
    });

$("#submit-password").click(function () { 
        var userId= JSON.parse(localStorage.getItem('User'))._id;
        var data = {            
            'NewPassword': $("#newPassword").val(),
            'OldPassword': $("#oldPassword").val(),
            'UserId': userId
                   
        };
        $.ajax({
            type: "POST",
            url: ServerAddress + "/api/changePassword?token=" + JSON.parse(localStorage.getItem('Token')),
            data: data,
            crossDomain: true,
            dataType: 'json',
            success: function (data, status, jqXHR) {
                $("#acceptP-modal").hide();
                $('.modal-backdrop').remove();
                toastr.success(data.message);
            },
            error: function (data, status) {
                $("#acceptP-modal").hide();
                $('.modal-backdrop').remove();
                toastr.error(JSON.parse(data.responseText).message);
            }
        });
    });