$( document ).ready(function() {

//Colorpicker
    $(".my-colorpicker2").colorpicker();
//Events on first load
    FormReset();
    GetCompany(FillTable,CompanyError);
});
   
    


    $("#new-servExecs").click(function () {
        $('#new-servExecs-modal-title').text('Unesi izvršitelja');
        $('#submit-servExecs-first').text('Unesi');
        FormReset();
    	$("#new-servExecs-modal").show();
    	
    });

    $(".closeModal").click(function () {
    	$("#new-servExecs-modal").hide();
        $("#accept-modal").modal('hide');
        $('.modal-backdrop').remove();
    	
    });

   
// DATATABLE //

    function FillTable (data) {
         // Save Company into storage
        localStorage.setItem('Company', JSON.stringify(data));
         for(i = 0; i < data.servExecs.length; i++){
            data.servExecs[i].DT_RowId = data.servExecs[i].servExecId;
            var color1 = data.servExecs[i].color;
            data.servExecs[i].color = '<div style="width: 41px; height: 36px; "><div style="width: 16px; height: 16px; background-color: '+ color1 +';"></div></div>'
        }
     var table = $('#servExecs-table').DataTable({
                    data: data.servExecs,
                    columns: [
                        { data: "name" },
                        { data: "color" },
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
                      className: "btn-sm"
                  },
                  {
                      extend: "pdfHtml5",
                      className: "btn-sm"
                  },
                  {
                      extend: "print",
                      className: "btn-sm"
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

     $('#servExecs-table tbody').on('click', '.btn-danger', function () {
        var data = $(this).parents('tr');
        var Id = data.attr('id');
        $("#delete-modal").show(); 
        $("#delete-modal").attr("SEId", Id)
        });
        $('#servExecs-table tbody').on('click', '.btn-info', function () {
            var data = $(this).parents('tr');
            var Id = data.attr('id');
            FormReset();
            //GET servExecs data by row id
           var ServExecs = JSON.parse(localStorage.getItem('Company')).servExecs;
            var ServExec = {};                     
            for (i = 0; i < ServExecs.length; i++) {
                if(ServExecs[i].servExecId == Id){
                    var ServExec = ServExecs[i];               
                }
                // Fill form with client data
                $('#new-servExecs-modal').attr('servExecs-id', ServExec.servExecId);
                $("#Name").val(ServExec.name);
                $("#Note").val(ServExec.note);
                $("#inputColor").val(ServExec.color);
                $("#color").css("background-color", ServExec.color);
                

            }
            $('#new-servExecs-modal-title').text('Uredite izvršitelja');
            $('#submit-servExecs-first').text('Spremi');
            $('#new-servExecs-modal').show();
        });
}
 

    $('#inputColor').click(function () {
        $('#addon').trigger("click");
    })
     // VALIDATION //
    $('#new-servExecs-form').parsley();

    $('#submit-servExecs-first').click(function (e) {
        $('#new-servExecs-form').parsley().validate();        
        if ($('#new-servExecs-form').parsley().isValid()) {                    
            $("#new-servExecs-modal").hide();
            $('#accept-modal').modal('show');          
        }
    });

    // Error functions //
    function CompanyError(data){
        toastr.error(JSON.parse(data.responseText).message);
    }

     // FORM RESET //
    var FormReset = function () {
        $('#new-servExecs-form').trigger("reset");
        $('#new-servExecs-form').parsley().reset();
        $('#color').css('background-color', 'white');
        $('#new-servExecs-modal').attr('servExecs-id', "No");
    };

    //Submit/update servExecs
    $("#submit-servExecs").click(function () {        
        var ServExec = {
            'servExecId': $("#new-servExecs-modal").attr("servExecs-id"),
            'name': $("#Name").val(),
            'color': $("#inputColor").val(),
            'note': $("#Note").val()
                   
        };
        var companyId= JSON.parse(localStorage.getItem('Company'))._id;
        //Check if add new servExecs or update existing
        if (ServExec.servExecId == "No") {
            //Add new servExecs
            delete ServExec['servExecId'];
            var data = {
                ServExec : ServExec,
                CompanyId : companyId
            }
            $.ajax({
                type: "POST",
                url: ServerAddress + "/api/addServExec?token=" + JSON.parse(localStorage.getItem('Token')),
                data: data,
                crossDomain: true,
                dataType: 'json',
                success: function (data, status, jqXHR) {
                    $("#accept-modal").modal('hide');
                    $('.modal-backdrop').remove(); 
                    GetCompany(FillTable,CompanyError);
                    FormReset();
                    toastr.success(data.message);
                   
                },
                error: function (data, status) {
                    $("#accept-modal").modal('hide');
                    $('.modal-backdrop').remove();
                    $("#new-servExecs-modal").modal('show'); 
                    toastr.error(JSON.parse(data.responseText).message);
                    
                }
            });
        }
        else {
            //Update existing ServExec
            var data = {
                ServExecId : ServExec.servExecId,
                ServExec : ServExec,
                CompanyId : companyId
            }
            $.ajax({
                type: "POST",
                url: ServerAddress + "/api/updateServExec?token=" + JSON.parse(localStorage.getItem('Token')),
                data: data,
                crossDomain: true,
                dataType: 'json',
                success: function (data, status, jqXHR) {
                    $("#accept-modal").modal('hide');
                    $('.modal-backdrop').remove();
                    GetCompany(FillTable,CompanyError);
                    FormReset();
                    toastr.success(data.message);
                },
                error: function (data, status) {
                    $("#accept-modal").modal('hide');
                    $('.modal-backdrop').remove();
                    $("#new-servExecs-modal").modal('show')
                    toastr.error(JSON.parse(data.responseText).message);
                }
            });
        }
    });

    //delete servExec
    $("#delete-servExec").click(function () {
        var companyId= JSON.parse(localStorage.getItem('Company'))._id;        
    var data = {
        ServExecId : $('#delete-modal').attr("SEId"),
        CompanyId : companyId
    }  
         $.ajax({
                type: "POST",
                url: ServerAddress + "/api/deleteServExec?token=" + JSON.parse(localStorage.getItem('Token')),
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

