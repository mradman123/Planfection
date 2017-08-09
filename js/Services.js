$( document ).ready(function() {

//Events on first load
    FormReset();
    GetCompany(FillTable,CompanyError);
});


    $("#new-services").click(function () {
      $('#new-services-modal-title').text('Unesite uslugu');
      $('#submit-services-first').text('Unesi');
      FormReset();
    	$("#new-services-modal").show();
    });

    $(".closeModal").click(function () {
    	$("#new-services-modal").hide();
    });


    // Error functions //
    function CompanyError(data){
        toastr.error(JSON.parse(data.responseText).message);
    }
// DATATABLE //

    function FillTable (data)  {
         // Save Company into storage
        localStorage.setItem('Company', JSON.stringify(data));
         for(i = 0; i < data.services.length; i++){
            data.services[i].DT_RowId = data.services[i].serviceId;
            /*if(data.services[i].public == "yes")
            {

                data.services[i].public = '<i class="fa fa-check" style="color: #00cc00;"></i>'

            }
            else{
                data.services[i].public = '<i class="fa fa-close" style="color: #dd4b39;"></i>'
            }*/
         }

     var table = $('#services-table').DataTable({
                    data: data.services,
                    columns: [
                        { data: "name" },
                        { data: "price" },/*
                        {data: "public"},*/
                        {
                            data: null,
                            className: "center",
                            defaultContent: '<a id="edit" class="btn btn-info btn-xs"><i class="fa fa-pencil"></i></a> <a data-toggle="modal" data-target="#delete-modal" class="btn btn-danger btn-xs"><i class="fa fa-trash-o "></i></a>'
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
                  {
                      extend: "excel",
                      className: "btn-sm hidden-xs"
                  },
                  {
                      extend: "pdfHtml5",
                      className: "btn-sm hidden-xs"
                  },
                  {
                      extend: "print",
                      className: "btn-sm hidden-xs"
                  },
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
     $('#services-table tbody').on('click', '.btn-danger', function () {
        var data = $(this).parents('tr');
        var Id = data.attr('id');
        $("#delete-modal").show();
        $("#delete-modal").attr("SerId", Id)
        });

        $('#services-table tbody').on('click', '.btn-info', function () {
            var data = $(this).parents('tr');
            var Id = data.attr('id');
            FormReset();
            //GET service data by row id
           var Services = JSON.parse(localStorage.getItem('Company')).services;
            var Service = {};
            for (i = 0; i < Services.length; i++) {
                if(Services[i].serviceId == Id){
                    var Service = Services[i];
                }
                // Fill form with client data
                $('#new-services-modal').attr('services-id', Service.serviceId);
                $("#Name").val(Service.name);
                $("#Note").val(Service.note);
                $("#Price").val(Service.price);
               /* if(Service.public=="yes")
                    $( "#Public" ).parent().addClass( 'checked' )
                else
                    $( "#Public" ).parent().removeClass( 'checked' )*/


            }
            $('#new-services-modal-title').text('Uredite uslugu');
            $('#submit-services-first').text('Spremi');
            $('#new-services-modal').show();
        });

 }


 // VALIDATION //
    $('#new-services-form').parsley();

    $('#submit-services-first').click(function (e) {
        $('#new-services-form').parsley().validate();
        if ($('#new-services-form').parsley().isValid()) {
            $("#new-services-modal").hide();
            $('#accept-modal').modal('show');
        }
    });

    // FORM RESET //
    var FormReset = function () {
        $('#new-services-form').trigger("reset");
        $('#new-services-form').parsley().reset();
        $('#new-services-modal').attr('services-id', "No");
    };

    //Submit/update services
    $("#submit-services").click(function () {
        /*var public = "";
        if ($( "#Public" ).parent().hasClass( 'checked' ))
        {
            public = "yes";
        }
        else
        {
            public = "no";
        }*/
        var Service = {
            'serviceId': $("#new-services-modal").attr("services-id"),
            'name': $("#Name").val(),
            'price': $("#Price").val(),
            'note': $("#Note").val(),
            /*'public': public*/

        };
     var companyId= JSON.parse(localStorage.getItem('Company'))._id;
        //Check if add new Service or update existing
        if (Service.serviceId == "No") {
            //Add new service
            delete Service['serviceId'];
            var data = {
                Service : Service,
                CompanyId : companyId
            }
            $.ajax({
                type: "POST",
                url: ServerAddress + "/api/addService?token=" + JSON.parse(localStorage.getItem('Token')),
                data: data,
                crossDomain: true,
                dataType: 'json',
                success: function (data, status, jqXHR) {
                    $("#accept-modal").modal('hide');
                    /*$('.modal-backdrop').remove(); */
                    GetCompany(FillTable,CompanyError);
                    FormReset();
                    toastr.success(data.message);

                },
                error: function (data, status) {
                    $("#accept-modal").modal('hide');
                    /*$('.modal-backdrop').remove(); */
                    $("#new-services-modal").modal('show');
                    toastr.error(JSON.parse(data.responseText).message);

                }
            });
        }
        else {
            //Update existing Service
            var data = {
                ServiceId : Service.serviceId,
                Service : Service,
                CompanyId : companyId
            }
            $.ajax({
                type: "POST",
                url: ServerAddress + "/api/updateService?token=" + JSON.parse(localStorage.getItem('Token')),
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
                    $("#accept-modal").modal('hide');
                    $('.modal-backdrop').remove();
                    $("#new-services-modal").modal('show')
                    toastr.error(JSON.parse(data.responseText).message);
                }
            });
        }
    });

    //delete service
    $("#delete-service").click(function () {
        var companyId= JSON.parse(localStorage.getItem('Company'))._id;
    var data = {
        ServiceId : $('#delete-modal').attr("SerId"),
        CompanyId : companyId
    }
         $.ajax({
                type: "POST",
                url: ServerAddress + "/api/deleteService?token=" + JSON.parse(localStorage.getItem('Token')),
                data: data,
                crossDomain: true,
                dataType: 'json',
                success: function (data, status, jqXHR) {
                   $('#delete-modal').modal('hide');
                    $('.modal-backdrop').remove();
                    GetCompany(FillTable,CompanyError);
                    FormReset();
                    toastr.success(data.message);


                },
                error: function (data, status) {
                    $('#delete-modal').modal('hide');
                    toastr.error(JSON.parse(data.responseText).message);

                }
            });


    });
