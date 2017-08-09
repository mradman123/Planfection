$( document ).ready(function() {
  // Set client name for update to check if it exists
  function SetClientName(Client){
    var ClientName = { 
                firstName: Client.firstName,
                lastName: Client.lastName
            }
    localStorage.setItem('ClientName', JSON.stringify(ClientName));
  }
  // Random color generator //
  function getRandomIconColor() {
    // var letters = '0123456789ABCDEF';
    // var color = '#';
    // for (var i = 0; i < 6; i++ ) {
    //     color += letters[Math.floor(Math.random() * 16)];
    // }
    var random = Math.floor(Math.random() * (6 - 0 + 1)) + 0;
    var color;
    if(random == 0)
      color = "bg-red";
    if(random == 1)
      color = "bg-blue";
    if(random == 2)
      color = "bg-red";
    if(random == 3)
      color = "bg-aqua";
    if(random == 4)
      color = "bg-green";
    if(random == 5)
      color = "bg-purple";
    if(random == 6)
      color = "bg-gray";
    return color;
  }
  // Sort appointments by date //
  function SortByDates(Appointments){
    // Appointments.date
    var date_sort_desc = function (app1, app2) {
      // This is a comparison function that will result in dates being sorted in
      // DESCENDING order.
      if (app1.dates > app2.dates) return -1;
      if (app1.dates < app2.dates) return 1;
      return 0;
    };
    Appointments.sort(date_sort_desc);
    return Appointments;
  }
  // GET all locations //
  var GetLocations = function () {
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
	// Error functions //
  function CompanyError(data){
      toastr.error(JSON.parse(data.responseText).message);
  };
  // Update company storage //
  function UpdateCompanyStorage(Company){
      localStorage.setItem('Company', JSON.stringify(Company));
  };

  //Initialize Select2 Elements
  $(".select2").select2();

  //Initialize input mask
  $("#DOB").inputmask("d.m.[y.]", { "placeholder": "dd.mm.gggg."});
  $('#PhoneNumber').inputmask({"mask": "(09[9])-999-999[9]"});

  //Modals   
  $(".closeModal").click(function () {
      $("#accept-modal").modal('hide');
      $('.modal-backdrop').remove();
  });

  //Fill Client data
  function FillClientForm(Client){
    // Fill form with client data
    $('#client-form').attr('client-id', Client.clientId);
    $("#FirstName").val(Client.firstName);
    $("#LastName").val(Client.lastName);
    $("#PhoneNumber").val(Client.phoneNumber);
    $("#Email").val(Client.email);
    $("#DOB").val(Client.dateOfBirth);
    $("#Address").val(Client.address);
    $("#Location").val(Client.locationId).trigger('change');
    $("#Note").val(Client.note);
  }

  // VALIDATION //
  $('#client-form').parsley();
  
  $('#submit-client-first').click(function (e) {
      $('#client-form').parsley().validate();
      if ($('#client-form').parsley().isValid()) {
          //Check if Client already exists
          var Clients = JSON.parse(localStorage.getItem('Company')).clients;
          var ClientName = JSON.parse(localStorage.getItem('ClientName'));
          var exists = 0;
          for (var i = 0; i < Clients.length; i++) {
              if(Clients[i].firstName == $("#FirstName").val() && Clients[i].lastName == $("#LastName").val() && ClientName.firstName != $("#FirstName").val() && ClientName.lastName != $("#LastName").val()){
                  exists++;                   
              }

          }    
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
          'clientId': $("#client-form").attr("client-id"),
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
              $("#accept-modal").modal('hide');
              $('.modal-backdrop').remove();
              GetCompany(UpdateCompanyStorage, CompanyError); 
              FillClientForm(data);
              GetCalendarAppointments(GetClientData,CompanyError);
              toastr.success(data.message);
          },
          error: function (data, status) {
              $("#accept-modal").modal('hide');
              $('.modal-backdrop').remove();
              $("#new-client-modal").modal('show')
              toastr.error(JSON.parse(data.responseText).message);
          }
      });

      
  });


	
  //GET Client data
	function GetClientData(data){
		var ClientId= JSON.parse(localStorage.getItem('ClientId'));
		var Company= JSON.parse(localStorage.getItem('Company'));
		var Client;
		var Appointments = [];
		var ServicesSum = 0;
		var Services = [];
		for (var i = 0; i < 12 ; i++) {
                    Services[i] = 0;                
    }		
		for(var i = 0; i < Company.clients.length; i ++){
			if(Company.clients[i].clientId == ClientId){
				Client=Company.clients[i];
			}
		}

    FillClientForm(Client);
    SetClientName(Client);
		$(".profile-username").text(Client.firstName + " " + Client.lastName);
		$('.profile-user-img').initial({name:Client.firstName});
		$('#appointments').text(Client.appointments);
		for(var j = 0; j < data.length; j ++){
			if(data[j].clientId == ClientId){
				Appointments.push(data[j]);
			}
		}
		for(var k = 0; k < Appointments.length; k ++){
			ServicesSum += Appointments[k].serviceIds.length;
		}
		$('#services').text(ServicesSum);
    if(Appointments.length != 0)
		  $('#last-app').text(Appointments[Appointments.length - 1].date);

    // Change appointment date string to date object //
    for(var i = 0; i < Appointments.length; i ++){
      var d = new Date(Appointments[i].date.split('.')[2],Appointments[i].date.split('.')[1] - 1,Appointments[i].date.split('.')[0],Appointments[i].start.split(':')[0],Appointments[i].start.split(':')[1]);
      Appointments[i].dates = d;
      
    }
    // Sort appointments by date //
    Appointments = SortByDates(Appointments);
    

		for (var i = 0; i < Appointments.length ; i++) {
      var str = Appointments[i].date.split(".")[1];

      Services[parseInt(str)-1] += Appointments[i].serviceIds.length;

      // FIll timeline //
      var id = Appointments[i].appointmentId;
      var start = Appointments[i].start;
      var end = Appointments[i].end;
      var date = Appointments[i].date;
      var start = Appointments[i].start;
      var servExec = Appointments[i].servExecName;
      var services = Appointments[i].services;
      var note = Appointments[i].note;

      // Append timeline object //

      jQuery('<li/>', {
        id: "liID-" + id,
      }).appendTo(".timeline");

      jQuery('<i/>', {
        id: "iID-" + id,
        class: "fa fa-calendar " +getRandomIconColor(),
      }).appendTo("#liID-" + id);

      jQuery('<div/>', {
        id: "timeline-itemID-" + id,
        class: "timeline-item",
      }).appendTo("#liID-" + id);

        jQuery('<span/>', {
          id: "timeID-" + id,
          class: "time",
        }).appendTo("#timeline-itemID-" + id);

          jQuery('<i/>', {
            class: "fa fa-clock-o",
          }).appendTo("#timeID-" + id);

          $("#timeID-" + id).append(" " + start + " - " + end);
          

        jQuery('<h3/>', {
          id: "timeline-headerID-" + id,
          class: "timeline-header",
        }).appendTo("#timeline-itemID-" + id);

           jQuery('<a/>', {
            href: "#",
            text: date,
          }).appendTo("#timeline-headerID-" + id);

          $("#timeline-headerID-" + id).append(" " + servExec);


        jQuery('<div/>', {
          id: "timeline-bodyID-" + id,
          class: "timeline-body",
        }).appendTo("#timeline-itemID-" + id);

          jQuery('<ul/>', {
            id: "services-listID-" + id,
          }).appendTo("#timeline-bodyID-" + id);

          for(var h = 0; h < services.length; h++){
             jQuery('<li/>', {
              text: services[h].name,
            }).appendTo("#services-listID-" + id);
          }

            

        $("#timeline-bodyID-" + id).append( note);
        // jQuery('<div/>', {
        //   id: "timeline-footerD",
        //   class: "timeline-footer",
        // }).appendTo("#timeline-itemID");



    }
		

   

    // INITIALIZE AREA CHART //

		// Get context with jQuery - using jQuery's .get() method.
    var areaChartCanvas = $("#areaChart").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var areaChart = new Chart(areaChartCanvas);

    var areaChartData = {
      labels: ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"],
      datasets: [
        {
          label: "Usluge",
          fillColor: "rgba(60,141,188,0.9)",
          strokeColor: "rgba(60,141,188,0.8)",
          pointColor: "#3b8bba",
          pointStrokeColor: "rgba(60,141,188,1)",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(60,141,188,1)",
          data: [Services[0], Services[1], Services[2], Services[3], Services[4], Services[5], Services[6], Services[7], Services[8], Services[9], Services[10], Services[11]]
        }
      ]
    };

    var areaChartOptions = {
      //Boolean - If we should show the scale at all
      showScale: true,
      //Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines: false,
      //String - Colour of the grid lines
      scaleGridLineColor: "rgba(0,0,0,.05)",
      //Number - Width of the grid lines
      scaleGridLineWidth: 1,
      //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true,
      //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines: true,
      //Boolean - Whether the line is curved between points
      bezierCurve: true,
      //Number - Tension of the bezier curve between points
      bezierCurveTension: 0.3,
      //Boolean - Whether to show a dot for each point
      pointDot: false,
      //Number - Radius of each point dot in pixels
      pointDotRadius: 4,
      //Number - Pixel width of point dot stroke
      pointDotStrokeWidth: 1,
      //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
      pointHitDetectionRadius: 20,
      //Boolean - Whether to show a stroke for datasets
      datasetStroke: true,
      //Number - Pixel width of dataset stroke
      datasetStrokeWidth: 2,
      //Boolean - Whether to fill the dataset with a color
      datasetFill: true,
      //String - A legend template
      legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
      //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
      maintainAspectRatio: true,
      //Boolean - whether to make the chart responsive to window resizing
      responsive: true
    };

    //Create the line chart
    areaChart.Line(areaChartData, areaChartOptions);

	};

	

	
	// Functions on start //
  GetLocations();
	GetCalendarAppointments(GetClientData,CompanyError);
	//GetCLientData();

});