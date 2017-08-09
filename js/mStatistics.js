// data from company
var COMPANY = JSON.parse(localStorage.getItem('Company'));

// data for statistics
var data = new Array();

// create object with data for a day
function dayData(day, nServices, nWorkingMinutes, nAppointments){

	var fDay = day;
	if(parseInt(fDay) < 10)
		fDay = '0' + fDay;

	return {
		'day' : String(fDay),
		'services' : nServices,
		'clients' : new Array(),
		'workingMinutes' : nWorkingMinutes,
		'appointments' : nAppointments,

	}
}

// initialize and sort data object 
function initializeData(){
	// last day of month
	var lastDayInMonth = new Date($('#year').val(),$('#month').val(),0).getDate();
	
	// fill data with JSON-s
	for(var i = 1; i < lastDayInMonth + 1;i++){
		data.push(dayData(i,0,0,0));
	}

	// data array is now initialised and sorted !!
}

// start and end date are the same
function DifferenceBetweenHours(startDate, startTime, endTime){

	try{
		// craete start and end
		var start = new Date(parseInt(startDate.split('.')[2]), parseInt(startDate.split('.')[1]) - 1, parseInt(startDate.split('.')[0]), parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1]), 0, 0);
		var end = new Date(parseInt(startDate.split('.')[2]), parseInt(startDate.split('.')[1]) - 1, parseInt(startDate.split('.')[0]), parseInt(endTime.split(':')[0]), parseInt(endTime.split(':')[1]), 0, 0);

		return (60 * Math.abs(end - start)) / 36e5;
	}
	catch(err){
		return -1;
	}	
}

function fillReport(){
	
	// initialize variables
	rServices = 0;
	rClients = 0;
	rWMinutes = 0;
	rAppointments = 0;

	// data foreach day
	for(var i = 0; i < data.length; i++){
		// add data
		rServices +=data[i].services;
		rClients +=data[i].clients.length;
		rAppointments += data[i].appointments;
		rWMinutes += data[i].workingMinutes;
	}
	var hh = parseInt(rWMinutes/60);
	var mm = parseInt((parseFloat(rWMinutes/60) - parseInt(rWMinutes/60))*60);
	hh = hh < 10 ? '0' + hh : hh; 
	mm = mm < 10 ? '0' + mm : mm; 

	
	$('#rServices').text(rServices);
	$('#rClients').text(rClients);
	$('#rAppointments').text(rAppointments);
	$('#rWhours').text(hh + ':' + mm);
}

// get real data from company
function fillData(){

  // clients who are already counted
  var countedClients = new Array();

	// appointments from company
	var appointments = COMPANY.appointments;

	// selected options
	var selectedMonth = $('#month').val();
	var selectedYear = $('#year').val();

	// foreach appointment
	for(var i=0; i < appointments.length; i++){
		// if appointment is in wanted month
		if(parseInt(selectedMonth) == parseInt(appointments[i].date.split('.')[1]) && parseInt(selectedYear) == parseInt(appointments[i].date.split('.')[2])){
			
			// increase appointments
			data[parseInt(appointments[i].date.split('.')[0])-1].appointments += 1;

			// increase services
			data[parseInt(appointments[i].date.split('.')[0])-1].services += appointments[i].serviceIds.length;

			
      if(countedClients.indexOf(appointments[i].clientId) == -1){
        data[parseInt(appointments[i].date.split('.')[0])-1].clients.push(appointments[i].clientId);
        countedClients.push(appointments[i].clientId);
      }

			// increase working hours
			data[parseInt(appointments[i].date.split('.')[0])-1].workingMinutes += DifferenceBetweenHours(appointments[i].date, appointments[i].start, appointments[i].end)
		}

	}
	console.log("DATA: ",data);
	fillReport();
}



function drawServiceChart(){

	var days = new Array();
	var dServices = new Array();

	for(var i = 0; i < data.length; i++){
		days.push(data[i].day);
		dServices.push(data[i].services);
	}

  // recreate chart
  $('#serviceChart').remove();
  $('#services').append($('<canvas>', {
        id: 'serviceChart',
        style: 'height:250px'
  }));

	// INITIALIZE AREA CHART //

	// Get context with jQuery - using jQuery's .get() method.
    var areaChartCanvas = $("#serviceChart").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var areaChart = new Chart(areaChartCanvas);

    var areaChartData = {
      labels: days,
      datasets: [
       
        {
          label: "Usluge",
          fillColor: "#00c0ef",
          strokeColor: "#00c0ef",
          pointColor: "#3b8bba",
          pointStrokeColor: "rgba(60,141,188,1)",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(60,141,188,1)",
          data: dServices
        }
      ]
    };

    var areaChartOptions = {
    	// set tooltip
   	   tooltipTemplate: function(label) {
		    return label.value;
	  },
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
}

function drawClientsChart(){

	var days = new Array();
	var dClients = new Array();

	for(var i = 0; i < data.length; i++){
		days.push(data[i].day);
		dClients.push(data[i].clients.length);
	}

  // recreate chart
  $('#clientsChart').remove();
  $('#clients').append($('<canvas>', {
        id: 'clientsChart',
        style: 'height:250px'
  }));



	// INITIALIZE AREA CHART //

	// Get context with jQuery - using jQuery's .get() method.
    var areaChartCanvas = $("#clientsChart").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var areaChart = new Chart(areaChartCanvas);

    var areaChartData = {
      labels: days,
      datasets: [
       
        {
          label: "Različiti klijenti",
          fillColor: "#00a65a",
          strokeColor: "#00a65a",
          pointColor: "#3b8bba",
          pointStrokeColor: "rgba(60,141,188,1)",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(60,141,188,1)",
          data: dClients
        }
      ]
    };

    var areaChartOptions = {
      // set tooltip
      tooltipTemplate: function(label) {
		    return label.value;
	  },
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
}

function drawAppointmentsChart(){

	var days = new Array();
	var dAppointments = new Array();

	for(var i = 0; i < data.length; i++){
		days.push(data[i].day);
		dAppointments.push(data[i].appointments);
	}

   // recreate chart
  $('#appointmentsChart').remove();
  $('#appointments').append($('<canvas>', {
        id: 'appointmentsChart',
        style: 'height:250px'
  }));

	// INITIALIZE AREA CHART //

	// Get context with jQuery - using jQuery's .get() method.
    var areaChartCanvas = $("#appointmentsChart").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var areaChart = new Chart(areaChartCanvas);

    var areaChartData = {
      labels: days,
      datasets: [
       
        {
          label: "Termini",
          fillColor: "#dd4b39",
          strokeColor: "#dd4b39",
          pointColor: "#3b8bba",
          pointStrokeColor: "rgba(60,141,188,1)",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(60,141,188,1)",
          data: dAppointments
        }
      ]
    };

    var areaChartOptions = {
      // set tooltip
      tooltipTemplate: function(label) {
		    return label.value;
	  },
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
}

function drawWHoursChart(){

	var days = new Array();
	var dWHours = new Array();

	for(var i = 0; i < data.length; i++){
		days.push(data[i].day);
		dWHours.push((data[i].workingMinutes/60).toFixed(2));
	}

  // recreate chart
  $('#wHoursChart').remove();
  $('#workingHours').append($('<canvas>', {
        id: 'wHoursChart',
        style: 'height:250px'
  }));

	// INITIALIZE AREA CHART //

	// Get context with jQuery - using jQuery's .get() method.
    var areaChartCanvas = $("#wHoursChart").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var areaChart = new Chart(areaChartCanvas);

    var areaChartData = {
      labels: days,
      datasets: [
       
        {
          label: "Radni sati",
          fillColor: "#f39c12",
          strokeColor: "#f39c12",
          pointColor: "#3b8bba",
          pointStrokeColor: "rgba(60,141,188,1)",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(60,141,188,1)",
          data: dWHours
        }
      ]
    };

    var areaChartOptions = {
    	// set tooltip
   	   tooltipTemplate: function(label) {
   	   		var hh = parseInt(label.value);
   	   		var mm = parseInt((parseFloat(label.value) - parseInt(label.value))*60)
   	   		hh = hh < 10 ? '0' + hh : hh; 
   	   		mm = mm < 10 ? '0' + mm : mm; 
		    return hh + ':' + mm;
	  },
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
}

// events for tab click
$('#servicesTab').on('shown.bs.tab', function(){

	drawServiceChart();
});

$('#clientTab').on('shown.bs.tab', function(){

	drawClientsChart();
});

$('#wHoursTab').on('shown.bs.tab', function(){

	drawWHoursChart();
});

$('#appointmentsTab').on('shown.bs.tab', function(){

	drawAppointmentsChart();
});
// end of events for tabl click

$('#month, #year').on('change',function(){
	try{
		data = new Array();
		initializeData();
		fillData();
		if($('#servicesTab').hasClass('active'))
			drawServiceChart();
		else if($('#clientTab').hasClass('active'))
			drawClientsChart();
		else if($('#wHoursTab').hasClass('active'))
			drawWHoursChart();
		else if($('#appointmentsTab').hasClass('active'))
			drawAppointmentsChart();
	}
	catch(error){
		toastr.error('Statistika se ne može prikazati.');
	}
	

	
});
