$( document ).ready(function() {

    function WorkingDaysColorChange(){
        //Change color of non-working days//
        var workingTime = JSON.parse(localStorage.getItem('Company')).workingTime;
        for(var i = 0; i < workingTime.length; i++){
            if(workingTime[i].open == "false"){
                var day = workingTime[i].day.substring(0,3);
                day = day.substr(0, 1).toLowerCase() + day.substr(1);
                $(".fc-"+ day).css("background-color", "#f4f4f5");
            }
        }
    }

 

	// Get all locations //
    function GetLocations() {
        $.ajax({
            type: "GET",
            url: ServerAddress + "/api/getLocations?token=" + JSON.parse(localStorage.getItem('Token')),
            crossDomain: true,
            dataType: 'jsonp',                
            
            success: function (Locations) {
               //Add locations to dropdown
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

   
    // Fill form dropdowns //
    function Dropdowns() {
        //Initialize Select2 Elements        
        $("#Client").select2({
        placeholder: "Odaberite klijenta",
        allowClear: true,
        dropdownAutoWidth: true,
        width: '100%'
        });
        $("#Service").select2({
            placeholder: "Odaberite usluge",
            allowClear: true,
            dropdownAutoWidth: true,
            width: '100%'
        });
        $("#ServExec").select2({
            placeholder: "Odaberite izvršitelja",
            allowClear: true,
            dropdownAutoWidth: true,
            width: '100%'
        });   
        // Add new client option to dropdown //
        $('#Client').append($('<option>', {
            value: "new",
            text: "Dodaj novog klijenta"
        })); 
        // Add clients to dropdown //  
        var Clients = JSON.parse(localStorage.getItem('Company')).clients;            
        $.each(Clients, function (i, item) {
            $('#Client').append($('<option>', {
                value: item.clientId,
                text: item.firstName + " " + item.lastName
            }));            
        });
        
        //Add users to dropdown    
        // var Users = JSON.parse(localStorage.getItem('Company')).users;    
        // $.each(Users, function (i, item) {
        //     $('#User').append($('<option>', {
        //         value: item.userId,
        //         text: item.firstName + " " + item.lastName
        //     }));
        // });
        //Add sevices to dropdown    
        var Services = JSON.parse(localStorage.getItem('Company')).services;           
        $.each(Services, function (i, item) {
            $('#Service').append($('<option>', {
                value: item.serviceId,
                text: item.name + " - " + item.price
            }));
        });
        //Add servExec to dropdown    
        var servExecs = JSON.parse(localStorage.getItem('Company')).servExecs;
        $.each(servExecs, function (i, item) {
            $('#ServExec').append($('<option>', {
                value: item.servExecId,
                text: item.name
            }));
        });  
        
    };
   
    // Appointment Form reset //
    function  FormReset  () {
        $('#new-appointment-form').trigger("reset");
        $('#new-appointment-form').parsley().reset();
        $("#Client").val('').trigger('change');
        $("#Service").val('').trigger('change');
        $("#ServExec").val('').trigger('change');
        $('#ClientErrorDiv').css({
            "display": "none"
        });
        $('#ServiceErrorDiv').css({
            "display": "none"
        });
        $('#new-appointment-modal').attr('appointment-id', "No");

    };

     // Client Form reset //
    function ClientFormReset () {
        $('#new-client-form').trigger("reset");
        $('#new-client-form').parsley().reset();
        $("#Location").val('').trigger('change');
    };

    // Error functions //
    function CompanyError(data){
        toastr.error(JSON.parse(data.responseText).message);
    };

    // CompanyId function //
    function CompanyId(){
        return(JSON.parse(localStorage.getItem('Company'))._id);
    };

    // Update company storage //
    function UpdateCompanyStorage(Company){
        localStorage.setItem('Company', JSON.stringify(Company));
        var Clients = Company.clients;            
        $('#Client').empty();
        $.each(Clients, function (i, item) {
            $('#Client').append($('<option>', {
                value: item.clientId,
                text: item.firstName + " " + item.lastName
            }));            
        });
    };
    // Update company storage and set new client //
    function UpdateCompanyStorageNewClient(Company){
        localStorage.setItem('Company', JSON.stringify(Company));
        var Clients = Company.clients;            
        $('#Client').empty();
        $.each(Clients, function (i, item) {
            $('#Client').append($('<option>', {
                value: item.clientId,
                text: item.firstName + " " + item.lastName
            }));            
        });
        $("#Client").val($('#Client option:last-child').val()).trigger("change");
    };




    // Update appointment function //
    function UpdateAppointment(data){
        
        $.ajax({
                type: "POST",
                url: ServerAddress + "/api/updateAppointment?token=" + JSON.parse(localStorage.getItem('Token')),
                data: data,
                crossDomain: true,
                dataType: 'json',
                success: function (data, status, jqXHR) {
                    $("#accept-modal").modal('hide');
                    $('.modal-backdrop').remove(); 
                    GetCalendarAppointments(FillCalendar,CompanyError);
                    GetCompany(UpdateCompanyStorage, CompanyError);
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

    };

    // Initialize clockpickers //
    $('#End-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Start").val();
            var end = $("#End").val();
            if(CompareHours(start,end) == false && start != ""){
                 toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
                $("#End").val("");
            }
        },
    });
    $('#Start-clockpicker').clockpicker({
        afterDone: function() {
            var start = $("#Start").val();
            var end = $("#End").val();
            if(CompareHours(start,end) == false && end != ""){
                 toastr.error("Vrijeme kraja radnog vremena mora biti poslije početka!");
                $("#Start").val("");
            }
        },
    });

    //Initialize datepicker
    $.fn.datepicker.defaults.language = 'hr';
    $('#Date').datepicker({
		startDate: '-3d',
		format: 'dd.mm.yyyy.',
      	autoclose: true,
        todayHighlight: true,
        weekStart: 1,
    });

    //Initialize input mask
    $("#DOB").inputmask("d.m.y.", { "placeholder": "dd.mm.gggg."});
    $('#PhoneNumber').inputmask({"mask": "(09[9])-999-999[9]"});


    // MODALS //
    $("#new-appointment").click(function () {        
        $("#Client option[value='new']").remove();
        $('#Client').prepend('<option value="new">Dodaj novog klijenta</option>');
        FormReset();
        $("#delete-appointment-first").hide();
        $('#new-appointment-modal-title').text('Unesite novi termin');
    	$("#new-appointment-modal").modal('show');
    });

    $(".closeModal").click(function () {
    	$("#new-appointment-modal").modal('hide');
        $("#accept-modal").modal('hide');
        $("#accept-event-modal").modal('hide');
        $("#delete-modal").modal('hide');
        $('.modal-backdrop').remove();
    });

    $(".closeClientModal").click(function () {
        $("#new-client-modal").modal('hide');
        $('.modal-backdrop').remove();
        $("#new-appointment-modal").modal('show');
    });

    $(".closeClientAcceptModal").click(function () {
        $("#accept-client-modal").modal('hide');
        $('.modal-backdrop').remove();
        $("#new-client-modal").modal('show');       
    });

    // Calendar //
    function FillCalendar (appointments) {
        var lastView;
        //localStorage.setItem('Company', JSON.stringify(data)); 
        var servExecs = JSON.parse(localStorage.getItem('Company')).servExecs;
        var workingTime = JSON.parse(localStorage.getItem('Company')).workingTime;
        var NUM_COLUMNS = servExecs.length + 1;
        var columnHeaders = [];
        for (var i = 0; i < servExecs.length; i++){
            columnHeaders.push(servExecs[i].name)
        }
        columnHeaders.push("Nije odabrano");
    	for(var i = 0; i < appointments.length; i++){
			// date of appointment start
            var StartYear =appointments[i].date.split('.')[2];
            var StartMonth = appointments[i].date.split('.')[1];
            var StartDay = appointments[i].date.split('.')[0];

            // time of appointment start
            var StartHours = appointments[i].start.split(':')[0];
            var StartMinutes = appointments[i].start.split(':')[1];

            // date of appointment end
            var EndYear =appointments[i].date.split('.')[2];
            var EndMonth = appointments[i].date.split('.')[1];
            var EndDay = appointments[i].date.split('.')[0];

            // time of appointment end
            var EndHours = appointments[i].end.split(':')[0];
            var EndMinutes = appointments[i].end.split(':')[1];

    		appointments[i].start = new Date(StartYear,StartMonth - 1,StartDay,StartHours,StartMinutes);
    		appointments[i].end = new Date(EndYear, EndMonth - 1, EndDay, EndHours, EndMinutes);
            
            // appointment title
            appointments[i].title =  appointments[i].clientName;
            if(appointments[i].services.length == 1)
            {
                appointments[i].title += " - " + appointments[i].services[0].name;
            }
            else if(appointments[i].services.length == 2)
            {
                appointments[i].title += " - " + appointments[i].services[0].name + ", " + appointments[i].services[1].name;
            }
            else if(appointments[i].services.length > 2)
            {
                appointments[i].title += " - " + appointments[i].services[0].name + ", " + appointments[i].services[1].name + "...";
            }
                        
            for (var j = 0; j < servExecs.length; j++){
                if(appointments[i].servExecId == servExecs[j].servExecId){
                    appointments[i].column = j;
                }
                if (appointments[i].servExecId == ""){
                    appointments[i].column = servExecs.length;
                } 
            }        	
    	}

        var minTime = "24:00";
        var maxTime = "00:00";
        for(var k = 0; k < workingTime.length; k++){

            if(workingTime[k].open == "true"){
                if(workingTime[k].workStart < minTime){
                    minTime = workingTime[k].workStart;
                }
                if(workingTime[k].workEnd  > maxTime){
                    maxTime = workingTime[k].workEnd;
                }
            }
        }

		$('#calendar').fullCalendar({
             views: {
                multiColAgendaDay: {
                    type: 'multiColAgenda',
                    duration: { days: 1 },
                    numColumns: NUM_COLUMNS,
                    columnHeaders: columnHeaders
                },
                multiColAgendaWeek: {
                    type: 'multiColAgenda',
                    duration: { weeks: 1 },
                    numColumns: NUM_COLUMNS,
                    columnHeaders: columnHeaders
                }
            },
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,multiColAgendaDay,listMonth'
				},
                buttonText: {
                    prev: 'prethodni',
                    next: 'slijedeći'
                },
				locale: 'hr',
                timezone: 'Europe/Belgrade',
				timeFormat: 'HH:mm',
                slotDuration: '00:30:01',
				buttonIcons: false, // show the prev/next text
				weekNumbers: true,
				navLinks: true, // can click day/week names to navigate views
				editable: true,
				eventLimit: true, // allow "more" link when too many events
                minTime: minTime + ":00",
                maxTime: maxTime + ":00",
				//events: appointments,
                eventClick: function(calEvent, jsEvent, view) {
                                FormReset();
                               
                                $(this).css('border-color', '#dd4b39');
                                
                                $("#new-appointment-modal").attr("appointment-id", calEvent.appointmentId);
                                $("#Date").val(calEvent.date);
                                $("#Start").val(moment(calEvent.start).format("HH:mm"));
                                $("#End").val(moment(calEvent.end).format("HH:mm"));
                                $("#Client").val(calEvent.clientId).trigger("change");
                                $("#Service").val(calEvent.serviceIds).trigger("change");
                                $("#ServExec").val(calEvent.servExecId).trigger("change");
                                $("#Note").val(calEvent.note);

                                $("#delete-appointment-first").show();
                                $('#new-appointment-modal-title').text('Uredite termin');
                                $("#new-appointment-modal").modal('show');
                                
                            },

                eventDrop: function(event, delta, revertFunc) { 
                                var view = $('#calendar').fullCalendar('getView');
                                var date = event.start.format('D')+ "." + event.start.format('M') +"."+ event.start.format('YYYY')+".";                                                               
                                var Appointment = {
                                    'appointmentId': event.appointmentId,
                                    'date': date,
                                    'start': event.start.format('HH:mm'),
                                    'end': event.end.format('HH:mm'),
                                    'clientId': event.clientId,
                                    'serviceIds':  event.serviceIds,
                                    'servExecId': event.servExecId,
                                    'note': event.note
                                };
                                //Check if day view to change servExecId
                                if(view.name == "multiColAgendaDay"){
                                    var servExecs = JSON.parse(localStorage.getItem('Company')).servExecs;
                                    Appointment.servExecId = "";
                                    for (var i = 0; i < servExecs.length; i++){
                                        if(i == event.column){
                                            Appointment.servExecId = servExecs[i].servExecId;
                                        }
                                    }
                                }
                                var companyId= CompanyId();
                                var data = {
                                    Appointment : Appointment,
                                    CompanyId : companyId
                                }   
                                // Check if appointment start < end //                             
                                if(CompareHours(Appointment.start,Appointment.end) == false){
                                    toastr.error("Vrijeme kraja termina mora biti poslije početka!");
                                }
                                else{
                                    $('#accept-event-modal').modal('show');
                                    $("#submit-event-appointment").unbind().click(function () {
                                        UpdateAppointment(data);
                                        $('#accept-event-modal').modal('hide');
                                    })
                                    $("#cancel-submit-event-appointment").unbind().click(function () {
                                        $('#accept-event-modal').modal('hide');
                                        revertFunc();
                                    });
                                    $(".closeEventModal").unbind().click(function () {
                                        $('#accept-event-modal').modal('hide');
                                        revertFunc();
                                    });
                                }
                                


                            },
                eventResize: function(event, delta, revertFunc) {
                                var view = $('#calendar').fullCalendar('getView');
                                var date = event.start.format('D')+ "." + event.start.format('M') +"."+ event.start.format('YYYY')+".";                               
                                var Appointment = {
                                    'appointmentId': event.appointmentId,
                                    'date': date,
                                    'start': event.start.format('HH:mm'),
                                    'end': event.end.format('HH:mm'),
                                    'clientId': event.clientId,
                                    'serviceIds':  event.serviceIds,
                                    'servExecId': event.servExecId,
                                    'note': event.note
                                };
                                //Check if day view to change servExecId
                                if(view.name == "multiColAgendaDay"){
                                    var servExecs = JSON.parse(localStorage.getItem('Company')).servExecs;
                                    Appointment.servExecId = "";
                                    for (var i = 0; i < servExecs.length; i++){
                                        if(i == event.column){
                                            Appointment.servExecId = servExecs[i].servExecId;
                                        }
                                    }
                                }
                                var companyId= CompanyId();
                                var data = {
                                    Appointment : Appointment,
                                    CompanyId : companyId
                                };
                                 // Check if appointment start < end //                             
                                if(CompareHours(Appointment.start,Appointment.end) == false){
                                    toastr.error("Vrijeme kraja termina mora biti poslije početka!");
                                } 
                                else{
                                    $('#accept-event-modal').modal('show');
                                    $("#submit-event-appointment").unbind().click(function () {
                                        UpdateAppointment(data);
                                        $('#accept-event-modal').modal('hide');
                                    });
                                    $("#cancel-submit-event-appointment").unbind().click(function () {
                                        $('#accept-event-modal').modal('hide');
                                        revertFunc();
                                    });
                                    $(".closeEventModal").unbind().click(function () {
                                        $('#accept-event-modal').modal('hide');
                                        revertFunc();
                                    });
                                };                              
                                

                            },
                dayClick: function( date, allDay, jsEvent, view) {
                                if (allDay) {
                                    // Clicked on the entire day              
                                        $("#Client option[value='new']").remove();
                                        $('#Client').prepend('<option value="new">Dodaj novog klijenta</option>');
                                        FormReset();
                                        $("#delete-appointment-first").hide();
                                        $('#new-appointment-modal-title').text('Unesite novi termin');
                                        $("#new-appointment-modal").modal('show');
                                        $("#Date").val(date.format('D.M.Y.'));
                                        if(date.format('HH:mm') == '00:00')
                                        {
                                            $("#Start").val('');
                                        }
                                        else
                                        {
                                            $("#Start").val(date.format('HH:mm'));
                                        }

                                    if ($(jsEvent.target).is('div.fc-day-number')) {      
                                        // Clicked on the day number 
                                        
                                        $('#calendar') 
                                            .fullCalendar('changeView', 'agendaDay')
                                            .fullCalendar('gotoDate', date.getFullYear(), date.getMonth(), date.getDate()); 
                                    }
                                }

                            },
                eventRender: function(event, element) {
                                $(element).addTouch();
                            },
                viewRender: function(view, element) { 

                     if (view.name != 'multiColAgendaDay') { 
                           WorkingDaysColorChange(); 
                        }
                    
                }


    
               

		});
        $('#calendar').fullCalendar( 'removeEvents' );
        $('#calendar').fullCalendar( 'removeEventSource', appointments);
        $('#calendar').fullCalendar( 'addEventSource', appointments);
        $('#calendar').fullCalendar( 'refetchEvents' );

        WorkingDaysColorChange();
       
	};


    // VALIDATION //
    $('#new-appointment-form').parsley();

    //Client parsley error
    $('#Client').parsley().on('field:error', function () {
        $('#ClientErrorDiv').css({
            "display": "block"
        });
    });    
    $('#Client').parsley().on('field:success', function () {
        $('#ClientErrorDiv').css({
            "display": "none"
        });
    });
    $("#Client").change(function () {
        if ($('#Client').parsley().isValid()) {
            $('#ClientErrorDiv').css({
                "display": "none"
            });
        } else {
            $('#ClientErrorDiv').css({
                "display": "block"
            });
        }
    });
    //Service parsley error
    $('#Service').parsley().on('field:error', function () {
        $('#ServiceErrorDiv').css({
            "display": "block"
        });
    });    
    $('#Service').parsley().on('field:success', function () {
        $('#ServiceErrorDiv').css({
            "display": "none"
        });
    });
    $("#Service").change(function () {
        if ($('#Service').parsley().isValid()) {
            $('#ServiceErrorDiv').css({
                "display": "none"
            });
        } else {
            $('#ServiceErrorDiv').css({
                "display": "block"
            });
        }
    });
    //ServExec parsley error
    $('#ServExec').parsley().on('field:error', function () {
        $('#ServExecErrorDiv').css({
            "display": "block"
        });
    });    
    $('#ServExec').parsley().on('field:success', function () {
        $('#ServiceErrorDiv').css({
            "display": "none"
        });
    });
    $("#ServExec").change(function () {
        if ($('#ServExec').parsley().isValid()) {
            $('#ServExecErrorDiv').css({
                "display": "none"
            });
        } else {
            $('#ServExecErrorDiv').css({
                "display": "block"
            });
        }
    });


    // Submit appointment form //
    $('#submit-appointment-first').click(function (e) {
        $('#new-appointment-form').parsley().validate();
        if ($('#new-appointment-form').parsley().isValid()) {
            $("#new-appointment-modal").modal('hide');
            $('.modal-backdrop').remove(); 
            $('#accept-modal').modal('show');            
        }
    });

    // Delete appointment modal //
    $('#delete-appointment-first').click(function (e) {
        $("#new-appointment-modal").modal('hide');
        $('.modal-backdrop').remove(); 
        $('#delete-modal').modal('show');            
        
    });

    // Submit/update Appointment // 
    $("#submit-appointment").click(function () {
        var Appointment = {
            'appointmentId': $("#new-appointment-modal").attr("appointment-id"),
            'date': $("#Date").val(),
            'start': $("#Start").val(),
            'end': $("#End").val(),
            'clientId': $("#Client").val(),
            'serviceIds': $("#Service").val(),
            'servExecId': $("#ServExec").val(),
            'note': $("#Note").val()
        };
        var companyId= CompanyId();
        
        //Check if add new purchase or update existing
        if (Appointment.appointmentId == "No") {
            //Add new Appointment
            delete Appointment['appointmentId'];
            var data = {
                Appointment : Appointment,
                CompanyId : companyId
            }
            $.ajax({
                type: "POST",
                url: ServerAddress + "/api/addAppointment?token=" + JSON.parse(localStorage.getItem('Token')),
                data: data,
                crossDomain: true,
                dataType: 'json',
                success: function (data, status, jqXHR) {
                    $("#accept-modal").modal('hide');
                    $('.modal-backdrop').remove();
                    GetCalendarAppointments(FillCalendar,CompanyError);
                    GetCompany(UpdateCompanyStorage, CompanyError);                 
                    FormReset();
                    toastr.success(data.message);                    
                   
                },
                error: function (data, status) {
                    $("#accept-modal").modal('hide');
                    $('.modal-backdrop').remove(); 
                    $("#new-appointment-modal").modal('show'); 
                    toastr.error(JSON.parse(data.responseText).message);
                    
                }
            });
        }
        else {
            //Update existing Appointment
            var data = {
                Appointment : Appointment,
                CompanyId : companyId
            }
            UpdateAppointment(data);
                       
        }


    });

    // Delete Appointment // 
    $("#delete-appointment").click(function () {        
        var companyId= CompanyId();         
        var data = {
            AppointmentId : $("#new-appointment-modal").attr("appointment-id"),
            CompanyId : companyId
        }
        $.ajax({
            type: "POST",
            url: ServerAddress + "/api/deleteAppointment?token=" + JSON.parse(localStorage.getItem('Token')),
            data: data,
            crossDomain: true,
            dataType: 'json',
            success: function (data, status, jqXHR) {
                $("#delete-modal").modal('hide');
                $('.modal-backdrop').remove();
                GetCalendarAppointments(FillCalendar,CompanyError);
                GetCompany(UpdateCompanyStorage, CompanyError);                   
                FormReset();
                toastr.success(data.message);                    
               
            },
            error: function (data, status) {
                $("#delete-modal").modal('hide');
                $('.modal-backdrop').remove(); 
                $("#new-client-modal").modal('show'); 
                toastr.error(JSON.parse(data.responseText).message);
                
            }
        });
                
    });
    

    // select add new client //
    $('#Client').on('change', function() {
      // Check if add new client is selected //
      if($(this).val() == "new"){
        $("#Client").val("").trigger("change");
        ClientFormReset();
        $("#new-client-modal").modal('show');
      }
    });

    $('#submit-client-first').click(function (e) {
        $('#new-client-form').parsley().validate();
        if ($('#new-client-form').parsley().isValid()) {
             //Check if Client already exists
            var Clients = JSON.parse(localStorage.getItem('Company')).clients;
            var exists = 0;
            for (var i = 0; i < Clients.length; i++) {
                if(Clients[i].firstName == $("#FirstName").val() && Clients[i].lastName == $("#LastName").val()){
                    exists++;                   
                }

            }

            $("#new-client-modal").modal('hide');
            $('.modal-backdrop').remove();
            $('#accept-client-modal').modal('show');
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
                $("#accept-client-modal").modal('hide');
                $('.modal-backdrop').remove(); 
                $("#new-appointment-modal").modal('show');                    
                //GetCompany(FillTable,CompanyError);
                GetCompany(UpdateCompanyStorageNewClient, CompanyError);               
                //ClientFormReset();
                toastr.success(data.message);
               
            },
            error: function (data, status) {
                $("#accept-client.modal").modal('hide');
                $('.modal-backdrop').remove(); 
                $("#new-client-modal").modal('show'); 
                toastr.error(JSON.parse(data.responseText).message);
                
            }
        });
       


    });



	//Events on first load
    FormReset();
    ClientFormReset();
    Dropdowns();
    GetCalendarAppointments(FillCalendar,CompanyError);
    GetLocations();

});