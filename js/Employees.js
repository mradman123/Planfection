$( document ).ready(function() {

    //Events on first load
    FormReset();
    
    var companyId = JSON.parse(localStorage.getItem('Company'))._id;
    var data ={
        CompanyId: companyId
    }
    $.ajax({
        type: "GET",
        url: ServerAddress + "/api/getEmployees?token=" + JSON.parse(localStorage.getItem('Token')),
        data: data,
        crossDomain: true,
        dataType: 'json',                       
        success: function (employees) {            
            FillTable(employees);           
            
        },
        error: function (passParams) {
        }
    });

    //Initialize input mask
    $('#PhoneNumber').inputmask({"mask": "(09[9])-999-999[9]"});

});



    $("#new-employees").click(function () {
      FormReset();
      $("#new-employees-modal").show();
    });

    $(".closeModal").click(function () {
    	$("#new-employees-modal").hide();
    });

     
// DATATABLE //

    var FillTable = function (employees) {
         var admin = [];
         for(i = 0; i < employees.length; i++){
            employees[i].DT_RowId = employees[i]._id;
            if(employees[i].role == 'AdministratorTvrtke')
                admin.push(employees[i]._id);

         }
     var table = $('#employees-table').DataTable({
                    data: employees,
                    columns: [
                        { data: "firstName" },
                        { data: "lastName" },
                        {data: "email"},
                        {data: "phoneNumber"},
                        {
                            data: null,
                            className: "center",
                            defaultContent: ' <a id="delete" class="btn btn-danger btn-xs"><i class="fa fa-trash-o "></i></a>'
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
     
        $('#employees-table tbody').on('click', '.btn-danger', function () {
                   
            var data = $(this).parents('tr');
            var Id = data.attr('id');
            if(admin.indexOf(Id) != -1)
                toastr.error("Ne možete brisati administratora.");
            else
            {
                $("#delete-modal").show(); 
                $("#delete-modal").attr("EmpId", Id)
            }


             
            
        });


   }

    // VALIDATION //
    $('#new-employees-form').parsley();

    $('#submit-employees-first').click(function (e) {
        $('#new-employees-form').parsley().validate();
        if ($('#new-employees-form').parsley().isValid()) {
            $("#new-employees-modal").hide();
            $('#accept-modal').modal('show');          
        }
    });

// FORM RESET //
    var FormReset = function () {
        $('#new-employees-form').trigger("reset");
        $('#new-employees-form').parsley().reset();
        // $('#GoodsMeasuringUnit').empty();
        // $('#GoodsQuality').empty();
        // $('#PurchasePrice').empty();
        // $('#errorDiv').css({
        //     "display": "none"
        // });
        // $('#cooperant-toggle').removeClass('select2-error');
        /*$('#new-services-modal').attr('client-id', 0);*/
    };

   //Submit/update employees
    $("#submit-employees").click(function () {  
     var companyId = JSON.parse(localStorage.getItem('Company'))._id;      
        var data = {
          User:{
              /*'Id': $("#new-employees-modal").attr("employees-id"),*/
            'firstName': $("#FirstName").val(),
            'lastName': $("#LastName").val(),
            'phoneNumber': $("#PhoneNumber").val(),
            'email': $("#Email").val(),
            'password': $("#Password").val(),
            'roleId' : "",
            'companyId' : companyId,
            'dateOfBirth' : "",
            'address' : "",
            'locationId' : "",
            'appointments' : [],
            'logins' : []
            }       
        };
        
            $.ajax({
                type: "POST",
                url: ServerAddress + "/api/addEmployee?token=" + JSON.parse(localStorage.getItem('Token')),
                data: data,
                crossDomain: true,
                dataType: 'json',
                success: function (data, status, jqXHR) {
                   $('#accept-modal').modal('hide'); 
                   toastr.success(data.message);
                   var companyId = JSON.parse(localStorage.getItem('Company'))._id;
                    var data ={
                        CompanyId: companyId
                    }
                    $.ajax({
                        type: "GET",
                        url: ServerAddress + "/api/getEmployees?token=" + JSON.parse(localStorage.getItem('Token')),
                        data: data,
                        crossDomain: true,
                        dataType: 'json',                       
                        success: function (employees) {            
                            FillTable(employees);
                        },
                        error: function (passParams) {
                        }
                    });
                    FormReset();
                    
                   
                },
                error: function (data, status) {
                    $('#accept-modal').modal('hide'); 
                    $('#new-employees-modal').modal('show'); 
                    toastr.error(JSON.parse(data.responseText).message);
                    
                }
            });
        
    });
//delete employee
    $("#delete-employees").click(function () {
        $('#delete-modal').modal('hide');
    var data = {
        UserId : $('#delete-modal').attr("EmpId")
    }  
         $.ajax({
                type: "POST",
                url: ServerAddress + "/api/deleteEmployee?token=" + JSON.parse(localStorage.getItem('Token')),
                data: data,
                crossDomain: true,
                dataType: 'json',
                success: function (data, status, jqXHR) {
                   $('#delete-modal').hide(); 
                    toastr.success(data.message);
                    var companyId = JSON.parse(localStorage.getItem('Company'))._id;
                    var data ={
                        CompanyId: companyId
                    }
                    $.ajax({
                        type: "GET",
                        url: ServerAddress + "/api/getEmployees?token=" + JSON.parse(localStorage.getItem('Token')),
                        data: data,
                        crossDomain: true,
                        dataType: 'json',                       
                        success: function (employees) {            
                            FillTable(employees);           
                        },
                        error: function (passParams) {
                        }
                    });

                   
                },
                error: function (data, status) {
                    $('#delete-modal').hide(); 
                    toastr.error(JSON.parse(data.responseText).message);
                    
                }
            });

       
    });

    $(".closeModal").click(function () {
        $("#delete-modal").hide();
    });


