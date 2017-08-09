$( document ).ready(function() {

    //GET all locations
    var GetLocations = function () {
            $.ajax({
                type: "GET",
                url: ServerAddress + "/api/getLocations?token=" + JSON.parse(localStorage.getItem('Token')),
                crossDomain: true,
                dataType: 'jsonp',

                success: function (Locations) {
                   //Add locations to dropdown
                   //console.log(Locations);
                    $.each(Locations, function (i, item) {
                        $('#Location').append($('<option>', {
                            value: item._id,
                            text: item.title
                        }));
                    });

                },
                error: function (passParams) {
                    // code here
                }
            });

    };
    //Initialize Select2 Elements
    $(".select2").select2();

    /*Initialize Select2 Elements*/
     $("#Location").select2({
        placeholder: "Odaberite mjesto",
        allowClear: true,
        dropdownAutoWidth: true,
        width: '100%'
    });

    // FORM RESET //
    var FormReset = function () {
        $('#new-client-form').trigger("reset");
        $('#new-client-form').parsley().reset();
        $('#new-client-modal').attr('client-id', "No");
        $("#Location").val('').trigger('change');
    };


    // Error functions //
    function CompanyError(data){
        toastr.error(JSON.parse(data.responseText).message);
    };



    //Initialize input mask
    $("#DOB").inputmask("d.m.[y.]", { "placeholder": "dd.mm.gggg."});
    $('#PhoneNumber').inputmask({"mask": "(09[9])-999-999[9]"});


    // MODALS //
    $("#new-client").click(function () {
        FormReset();
        $('#new-client-modal-title').text('Unesite novog klijenta');
    	$("#new-client-modal").modal('show');
    });

    $(".closeModal").click(function () {
        $("#accept-modal").modal('hide');
        $('.modal-backdrop').remove();
        $("#new-client-modal").modal('hide');
    });
    $(".closeAcceptModal").click(function () {
        $("#accept-modal").modal('hide');
        $('.modal-backdrop').remove();
        $("#new-client-modal").modal('show');
    });


    // DATATABLE //

    function FillTable (data) {
        // Save Company into storage
        localStorage.setItem('Company', JSON.stringify(data));
         for(i = 0; i < data.clients.length; i++){
            data.clients[i].DT_RowId = data.clients[i].clientId;
            //console.log(data.clients[i].clientId)
         }
         //console.log(data.clients)
         var table = $('#clients-table').DataTable({
                        data: data.clients,
                        idSrc: "clientId",
                        columns: [
                            { data: "firstName" },
                            { data: "lastName" },
                            { data: "phoneNumber" },
                            { data: "email" },
                            { data: "appointments" },
                            {
                                data: null,
                                className: "center",
                                defaultContent: '<a id="profile" href="ClientProfile.html" class="btn btn-success btn-xs"><i class="fa fa-user"></i></a> <a id="edit" class="btn btn-info btn-xs"><i class="fa fa-pencil"></i></a>'
                            }
                        ],
                        "language":{
                        "sEmptyTable":      "Nema podataka u tablici",
                        "sInfo":            "Prikazano _START_ do _END_ od _TOTAL_ rezultata",
                        "sInfoEmpty":       "Prikazano 0 do 0 od 0 rezultata",
                        "sInfoFiltered":    "(filtrirano iz _MAX_ ukupnih rezultata)",
                        "sInfoPostFix":     "",
                        "sInfoThousands":   ",",
                        "sLengthMenu":      "Prikaži _MENU_ rezultata po stranici",
                        "sLoadingRecords":  "Dohvaćam...",
                        "sProcessing":      "Obrađujem...",
                        "sSearch":          "Pretraži:",
                        "sZeroRecords":     "Ništa nije pronađeno",
                        "oPaginate": {
                            "sFirst":       "Prva",
                            "sPrevious":    "Nazad",
                            "sNext":        "Naprijed",
                            "sLast":        "Zadnja"
                        },
                        "oAria": {
                            "sSortAscending":  ": aktiviraj za rastući poredak",
                            "sSortDescending": ": aktiviraj za padajući poredak"
                        }
                    },
                        dom: "lBfrtip",
                        responsive: true,
                        pageLength: 10,
                        destroy: true,
                        buttons: [
                        'pdf'
                        ],
                        responsive: {
                          details: {
                              renderer: function (api, rowIdx, columns) {
                                  var data = $.map(columns, function (col, i) {
                                      return col.hidden ?
                                          '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                                              '<td>' + col.title + ':' + '</td> ' +
                                              '<td>' + col.data + '</td>' +
                                          '</tr>' :
                                          '';
                                  }).join('');

                                  return data ?
                                      $('<table/>').append(data) :
                                      false;
                              }
                          }
                    }


         });

        //  $('#clients-table tbody').on('click', '.btn-danger', function (e) {
        //     var data = table.row($(this).parents('tr')).data();
        //     var Id = data.DT_RowId;
        //     console.log(Id)
        //     //$("#delete-modal").attr("PurId", Id)
        // });

        $('#clients-table tbody').on('click', '.btn-success', function (e) {
            var data = $(this).parents('tr');
            var Id = data.attr('id');
            //console.log(Id);
            // Save User into storage
            localStorage.setItem('ClientId', JSON.stringify(Id));
            //$(window).location.href = '/ClientProfile.html';

        });


        $('#clients-table tbody').on('click', '.btn-info', function (e) {
            var data = $(this).parents('tr');
            var Id = data.attr('id');
            FormReset();
            var Clients = JSON.parse(localStorage.getItem('Company')).clients;
            var Client = {};
            for (i = 0; i < Clients.length; i++) {
                if(Clients[i].clientId == Id){
                    var Client = Clients[i];
                }
                // Fill form with client data
                $('#new-client-modal').attr('client-id', Client.clientId);
                $("#FirstName").val(Client.firstName);
                $("#LastName").val(Client.lastName);
                $("#PhoneNumber").val(Client.phoneNumber);
                $("#Email").val(Client.email);
                $("#DOB").val(Client.dateOfBirth);
                $("#Address").val(Client.address);
                $("#Location").val(Client.locationId).trigger('change');
                $("#Note").val(Client.note);

            }
            var ClientName = {
                firstName: Client.firstName,
                lastName: Client.lastName
            }
            localStorage.setItem('ClientName', JSON.stringify(ClientName));
            $('#new-client-modal-title').text('Uredite klijenta');
            $('#new-client-modal').modal('show');
        });



    }

    // VALIDATION //
    $('#new-client-form').parsley();

    $('#submit-client-first').click(function (e) {
        $('#new-client-form').parsley().validate();
        //console.log($('#new-client-form').parsley().isValid())
        if ($('#new-client-form').parsley().isValid()) {
            //Check if Client already exists
            var Clients = JSON.parse(localStorage.getItem('Company')).clients;
            var ClientName = JSON.parse(localStorage.getItem('ClientName'));
            var exists = 0;
            for (var i = 0; i < Clients.length; i++) {
                if(Clients[i].firstName == $("#FirstName").val() && Clients[i].lastName == $("#LastName").val() && ClientName.firstName != $("#FirstName").val() && ClientName.lastName != $("#LastName").val()){
                    exists++;
                }

            }
            $("#new-client-modal").modal('hide');
            $('#accept-modal').modal('show');
            if(exists == 1){
                toastr.error("Već postoji klijent s tim imenom i prezimenom!");
            }
            else if(exists > 1){
                toastr.error("Već postoje "+ exists +" klijenta s tim imenom i prezimenom!");
            }
        }
    });



    //Submit/update Client
    $("#submit-client").click(function () {
        var Location = $("#Location").val();
        if(Location == null)
            Location = "";
        var Client = {
            'clientId': $("#new-client-modal").attr("client-id"),
            'firstName': $("#FirstName").val(),
            'lastName': $("#LastName").val(),
            'phoneNumber': $("#PhoneNumber").val(),
            'email': $("#Email").val(),
            'dateOfBirth': $("#DOB").val(),
            'address': $("#Address").val(),
            'locationId': Location,
            'note': $("#Note").val()
        };
        var companyId= JSON.parse(localStorage.getItem('Company'))._id;

        //Check if add new purchase or update existing
        if (Client.clientId == "No") {
            //Add new Client
            delete Client['clientId'];
            var data = {
                Client : Client,
                CompanyId : companyId
            }
            $.ajax({
                type: "POST",
                url: ServerAddress + "/api/addClient?token=" + JSON.parse(localStorage.getItem('Token')),
                data: data,
                crossDomain: true,
                dataType: 'json',
                success: function (data, status, jqXHR) {
                   // console.log("Success ADD hide accept modal + backdrop")
                    $("#accept-modal").modal('hide');
                    $('.modal-backdrop').remove();
                    GetCompany(FillTable,CompanyError);
                    FormReset();
                    toastr.success(data.message);

                },
                error: function (data, status) {
                   // console.log("Error ADD hide accept modal + backdrop + show new-client-modal")
                    $("#accept-modal").modal('hide');
                    $('.modal-backdrop').remove();
                    $("#new-client-modal").modal('show');
                    toastr.error(JSON.parse(data.responseText).message);

                }
            });
        }
        else {
            //Update existing Client
            var data = {
                ClientId : Client.clientId,
                Client : Client,
                CompanyId : companyId
            }
            $.ajax({
                type: "POST",
                url: ServerAddress + "/api/updateClient?token=" + JSON.parse(localStorage.getItem('Token')),
                data: data,
                crossDomain: true,
                dataType: 'json',
                success: function (data, status, jqXHR) {
                    //console.log("Success UPDATE hide accept modal + backdrop")
                    $("#accept-modal").modal('hide');
                    $('.modal-backdrop').remove();
                    GetCompany(FillTable,CompanyError);
                    FormReset();
                    toastr.success(data.message);
                },
                error: function (data, status) {
                    ("Error UPDATE hide accept modal + backdrop + show new-client-modal")
                    $("#accept-modal").modal('hide');
                    $('.modal-backdrop').remove();
                    $("#new-client-modal").modal('show')
                    toastr.error(JSON.parse(data.responseText).message);
                }
            });
        }
    });


    //Events on first load
    FormReset();
    GetCompany(FillTable,CompanyError);
    GetLocations();





});
