$( document ).ready(function() {

    
	//Initialize input mask
    $('#inputContact').inputmask({"mask": "(09[9])-999-999[9]"});

    WorkingHours();
    GetCompany(Fill,CompanyError);
    GetCompany(FIllWorkingHours,CompanyError);

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
            $("#numEmp").text(employees.length);           
            
        },
        error: function (passParams) {
        }
    });
});

// Compare hours //
function CompareHours(start, end){
    var start = start.split(':');
    var end = end.split(':');
    if(start[0] > end[0]){
        return false;
    }
    else if(start[0] == end[0] && start[1] >= end[1]){
        return false;
    }
    return true;
}

// Error functions //
function CompanyError(data){
    toastr.error(JSON.parse(data.responseText).message);
}

var Fill = function (data) {
	$("#Title").text(data.title);
	$("#Type").text(data.companyType);
	$("#numSE").text(data.servExecs.length);
	$("#numS").text(data.services.length);
	$("#numC").text(data.clients.length);
	$("#title").text(data.title);
	$("#type").text(data.companyType);
	$("#oib").text(data.OIB);
	$("#exp_date").text(data.expirationDate);
	$("#address").text(data.address + ", " + data.location);
	$("#inputEmail").val(data.email);
	$("#inputContact").val(data.phoneNumber);
	$("#inputAddress").val(data.webSite);

}

 // VALIDATION //
$('#company-form').parsley();

$("#save").click(function () {  
    $('#company-form').parsley().validate();
    if ($('#company-form').parsley().isValid()) 
        $("#accept-modal").show();      
            
});

$(".closeModal").click(function () {
    $("#accept-modal").hide();        
});

$("#submit-Cosettings").click(function () { 
    var companyId= JSON.parse(localStorage.getItem('Company'))._id;
    var data = {
        'Email': $("#inputEmail").val(),
        'PhoneNumber': $("#inputContact").val(),
        'WebSite': $("#inputAddress").val(),
        'CompanyId': companyId
               
    };
    $.ajax({
        type: "POST",
        url: ServerAddress + "/api/editCompany?token=" + JSON.parse(localStorage.getItem('Token')),
        data: data,
        crossDomain: true,
        dataType: 'json',
        success: function (data, status, jqXHR) {
            $("#accept-modal").hide();
            GetCompany(Fill,CompanyError);
            toastr.success(data.message);
        },
        error: function (data, status) {
            $("#accept-modal").hide();
            toastr.error(JSON.parse(data.responseText).message);
        }
    });
});

// Initialise working hours form //
function WorkingHours(){

    var Week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    // for(var i = 0 ; i < Week.length; i++){
    //     // Working hours //
    //     //Start//
    //     $('#'+Week[i]+'-start-clockpicker').clockpicker({
    //         afterDone: function() {
    //             var start = $("#"+Week[i]+"-start").val();
    //             var end = $("#"+Week[i]+"-end").val();
    //             if(CompareHours(start,end) == false && end != ""){
    //                  toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
    //                 $("#"+Week[i]+"-start").val("");
    //             }
    //         },
    //     });
    //     //End//
    //     $('#'+Week[i]+'end-clockpicker').clockpicker({
    //         afterDone: function() {
    //             var start = $("#"+Week[i]+"-start").val();
    //             var end = $("#"+Week[i]+"-end").val();
    //             if(CompareHours(start,end) == false && start != ""){
    //                  toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
    //                 $("#"+Week[i]+"-end").val("");
    //             }
    //         },
    //     });

    // }

    // Initialize clockpickers //
    // Working hours //
    // Monday //
    $('#Monday-end-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Monday-start").val();
            var end = $("#Monday-end").val();
            if(CompareHours(start,end) == false && start != ""){
                 toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
                $("#Monday-end").val("");
            }
        },
    });
    $('#Monday-start-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Monday-start").val();
            var end = $("#Monday-end").val();
            if(CompareHours(start,end) == false && end != ""){
                 toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
                $("#Monday-start").val("");
            }
        },
    });

    // Tuesday //
    $('#Tuesday-end-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Tuesday-start").val();
            var end = $("#Tuesday-end").val();
            if(CompareHours(start,end) == false && start != ""){
                 toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
                $("#Tuesday-end").val("");
            }
        },
    });
    $('#Tuesday-start-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Tuesday-start").val();
            var end = $("#Tuesday-end").val();
            if(CompareHours(start,end) == false && end != ""){
                 toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
                $("#Tuesday-start").val("");
            }
        },
    });

    // Wednesday //
    $('#Wednesday-end-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Wednesday-start").val();
            var end = $("#Wednesday-end").val();
            if(CompareHours(start,end) == false && start != ""){
                 toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
                $("#Wednesday-end").val("");
            }
        },
    });
    $('#Wednesday-start-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Wednesday-start").val();
            var end = $("#Wednesday-end").val();
            if(CompareHours(start,end) == false && end != ""){
                 toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
                $("#Wednesday-start").val("");
            }
        },
    });

    // Thursday //
    $('#Thursday-end-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Thursday-start").val();
            var end = $("#Thursday-end").val();
            if(CompareHours(start,end) == false && start != ""){
                 toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
                $("#Thursday-end").val("");
            }
        },
    });
    $('#Thursday-start-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Thursday-start").val();
            var end = $("#Thursday-end").val();
            if(CompareHours(start,end) == false && end != ""){
                 toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
                $("#Thursday-start").val("");
            }
        },
    });


    // Friday //
    $('#Friday-end-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Friday-start").val();
            var end = $("#Friday-end").val();
            if(CompareHours(start,end) == false && start != ""){
                 toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
                $("#Friday-end").val("");
            }
        },
    });
    $('#Friday-start-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Friday-start").val();
            var end = $("#Friday-end").val();
            if(CompareHours(start,end) == false && end != ""){
                 toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
                $("#Friday-start").val("");
            }
        },
    });

    // Saturday //
    $('#Saturday-end-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Saturday-start").val();
            var end = $("#Saturday-end").val();
            if(CompareHours(start,end) == false && start != ""){
                 toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
                $("#Saturday-end").val("");
            }
        },
    });
    $('#Saturday-start-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Saturday-start").val();
            var end = $("#Saturday-end").val();
            if(CompareHours(start,end) == false && end != ""){
                 toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
                $("#Saturday-start").val("");
            }
        },
    });

    // Sunday //
    $('#Sunday-end-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Sunday-start").val();
            var end = $("#Sunday-end").val();
            if(CompareHours(start,end) == false && start != ""){
                 toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
                $("#Sunday-end").val("");
            }
        },
    });
    $('#Sunday-start-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Sunday-start").val();
            var end = $("#Sunday-end").val();
            if(CompareHours(start,end) == false && end != ""){
                 toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
                $("#Sunday-start").val("");
            }
        },
    });

    // ----------------------- Break --------------------------- //

    // Monday //
    $('#Monday-end-break-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Monday-start-break").val();
            var end = $("#Monday-end-break").val();
            if(CompareHours(start,end) == false && start != ""){
                 toastr.error("Vrijeme kraja pauze mora biti poslije početka!");
                $("#Monday-end-break").val("");
            }
        },
    });
    $('#Monday-start-break-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Monday-start-break").val();
            var end = $("#Monday-end-break").val();
            if(CompareHours(start,end) == false && end != ""){
                 toastr.error("Vrijeme kraja pauze mora biti poslije početka!");
                $("#Monday-start-break").val("");
            }
        },
    });

    // Tuesday //
    $('#Tuesday-end-break-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Tuesday-start-break").val();
            var end = $("#Tuesday-end-break").val();
            if(CompareHours(start,end) == false && start != ""){
                 toastr.error("Vrijeme kraja pauze mora biti poslije početka!");
                $("#Tuesday-end-break").val("");
            }
        },
    });
    $('#Tuesday-start-break-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Tuesday-start-break").val();
            var end = $("#Tuesday-end-break").val();
            if(CompareHours(start,end) == false && end != ""){
                 toastr.error("Vrijeme kraja pauze mora biti poslije početka!");
                $("#Tuesday-start-break").val("");
            }
        },
    });

    // Wednesday //
    $('#Wednesday-end-break-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Wednesday-start-break").val();
            var end = $("#Wednesday-end-break").val();
            if(CompareHours(start,end) == false && start != ""){
                 toastr.error("Vrijeme kraja pauze mora biti poslije početka!");
                $("#Wednesday-end-break").val("");
            }
        },
    });
    $('#Wednesday-start-break-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Wednesday-start-break").val();
            var end = $("#Wednesday-end-break").val();
            if(CompareHours(start,end) == false && end != ""){
                 toastr.error("Vrijeme kraja pauze mora biti poslije početka!");
                $("#Wednesday-start-break").val("");
            }
        },
    });

     // Thursday //
    $('#Thursday-end-break-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Thursday-start-break").val();
            var end = $("#Thursday-end-break").val();
            if(CompareHours(start,end) == false && start != ""){
                 toastr.error("Vrijeme kraja pauze mora biti poslije početka!");
                $("#Thursday-end-break").val("");
            }
        },
    });
    $('#Thursday-start-break-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Thursday-start-break").val();
            var end = $("#Thursday-end-break").val();
            if(CompareHours(start,end) == false && end != ""){
                 toastr.error("Vrijeme kraja pauze mora biti poslije početka!");
                $("#Thursday-start-break").val("");
            }
        },
    });

    // Friday //
    $('#Friday-end-break-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Friday-start-break").val();
            var end = $("#Friday-end-break").val();
            if(CompareHours(start,end) == false && start != ""){
                 toastr.error("Vrijeme kraja pauze mora biti poslije početka!");
                $("#Friday-end-break").val("");
            }
        },
    });
    $('#Friday-start-break-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Friday-start-break").val();
            var end = $("#Friday-end-break").val();
            if(CompareHours(start,end) == false && end != ""){
                 toastr.error("Vrijeme kraja pauze mora biti poslije početka!");
                $("#Friday-start-break").val("");
            }
        },
    });

    // Saturday //
    $('#Saturday-end-break-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Saturday-start-break").val();
            var end = $("#Saturday-end-break").val();
            if(CompareHours(start,end) == false && start != ""){
                 toastr.error("Vrijeme kraja pauze mora biti poslije početka!");
                $("#Saturday-end-break").val("");
            }
        },
    });
    $('#Saturday-start-break-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Saturday-start-break").val();
            var end = $("#Saturday-end-break").val();
            if(CompareHours(start,end) == false && end != ""){
                 toastr.error("Vrijeme kraja pauze mora biti poslije početka!");
                $("#Saturday-start-break").val("");
            }
        },
    });


    // Sunday //
    $('#Sunday-end-break-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Sunday-start-break").val();
            var end = $("#Sunday-end-break").val();
            if(CompareHours(start,end) == false && start != ""){
                 toastr.error("Vrijeme kraja pauze mora biti poslije početka!");
                $("#Sunday-end-break").val("");
            }
        },
    });
    $('#Sunday-start-break-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Sunday-start-break").val();
            var end = $("#Sunday-end-break").val();
            if(CompareHours(start,end) == false && end != ""){
                 toastr.error("Vrijeme kraja pauze mora biti poslije početka!");
                $("#Sunday-start-break").val("");
            }
        },
    });


    // --------------------- Initialize check boxes ---------------------- //
    for(var i = 0 ; i < Week.length; i++){
        $('#'+Week[i]+'-open').iCheck({
            checkboxClass: 'icheckbox_square-red',
            radioClass: 'iradio_square-red',
            increaseArea: '20%' // optional
        });
    }
    
}





// Fill working hours form //
function FIllWorkingHours(data){
    localStorage.setItem('Company', JSON.stringify(data));
    var workingHours= data.workingTime;
    for(var i = 0; i < workingHours.length; i++){
        $("#" + workingHours[i].day + "-start").val(workingHours[i].workStart);
        $("#" + workingHours[i].day + "-end").val(workingHours[i].workEnd);
        $("#" + workingHours[i].day + "-start-break").val(workingHours[i].breakStart);
        $("#" + workingHours[i].day + "-end-break").val(workingHours[i].breakEnd);

        if(workingHours[i].open == "true" ){
            $("#" + workingHours[i].day + "-open").iCheck('check');
            
        }
        else{
            $("#" + workingHours[i].day + "-open").iCheck('uncheck');        
        }
    }
}

  // VALIDATION //
$('#workinghours-form').parsley();

$("#submit-workinghours-first").click(function () { 
    $('#workinghours-form').parsley().validate();
    if ($('#workinghours-form').parsley().isValid()) 
        $("#accept-workinghours-modal").show();      
            
});

$(".closeWorkinghoursModal").click(function () {
    $("#accept-workinghours-modal").hide();        
});

$("#submit-workinghours").click(function () { 
    var companyId= JSON.parse(localStorage.getItem('Company'))._id;
    var WorkingTime = []
    var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    for(var i = 0; i < weekdays.length; i++){
        var day ={
            day : weekdays[i],
            open : $("#" + weekdays[i] + "-open").iCheck('update')[0].checked,
            workStart : $("#" + weekdays[i] + "-start").val(),
            workEnd : $("#" + weekdays[i] + "-end").val(),
            breakStart : $("#" + weekdays[i] + "-start-break").val(),
            breakEnd : $("#" + weekdays[i] + "-end-break").val(),
        }
        WorkingTime.push(day);       
    }
    var data = {
        'CompanyId': companyId,
        'WorkingTime': WorkingTime
               
    };
    $.ajax({
        type: "POST",
        url: ServerAddress + "/api/updateWorkingTime?token=" + JSON.parse(localStorage.getItem('Token')),
        data: data,
        crossDomain: true,
        dataType: 'json',
        success: function (data, status, jqXHR) {
            $("#accept-workinghours-modal").hide();
            GetCompany(FIllWorkingHours,CompanyError);
            toastr.success(data.message);
        },
        error: function (data, status) {
            $("#accept-workinghours-modal").hide();
            toastr.error(JSON.parse(data.responseText).message);
        }
    });
});

$('.icheck').on('ifChecked', function(event){
    var id = $(this).children("div").children("input").attr("id");
    id = id.replace("-open","");
    $( "#" + id + "-start" ).prop( "disabled", false );    
    $( "#" + id + "-end" ).prop( "disabled", false );
    $( "#" + id + "-start-break" ).prop( "disabled", false );
    $( "#" + id + "-end-break" ).prop( "disabled", false );
});

$('.icheck').on('ifUnchecked', function(event){
    var id = $(this).children("div").children("input").attr("id");
    id = id.replace("-open","");
    $( "#" + id + "-start" ).prop( "disabled", true );
    $( "#" + id + "-start").val("06:00");
    $( "#" + id + "-end" ).prop( "disabled", true );
    $( "#" + id + "-end" ).val("23:00");
    $( "#" + id + "-start-break" ).prop( "disabled", true );
    $( "#" + id + "-start-break" ).val("00:00");
    $( "#" + id + "-end-break" ).prop( "disabled", true );
    $( "#" + id + "-end-break" ).val("00:00");
});




   