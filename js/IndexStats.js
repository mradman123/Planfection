var company = JSON.parse(localStorage.getItem('Company'));

var monthNames = ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"];



// create new date object
var date = new Date();
// get current month
var month = date.getMonth() + 1;
// get current year
var year = date.getFullYear(); 

// store stat values
var cntAppointments = 0;
var cntClients = 0;
var cntServices = 0;
var cntWorkingHours = 0;

// create new array for counting services in each month
var servicesPerMonth = [0,0,0,0,0,0,0,0,0,0,0,0]

// end of stats variables

var REFRESH_RATE = 15000;


// appointments - array 
// mountNumber - [1,12] number
// year - number
function CountSerivicesInMonth(appointments, mountNumber,year){
	
	try{
		// save number of services in counter
		var counter = 0;
		// for each appointment
		for(var i=0; i < appointments.length; i++){
			// if appointment date match requirements
			if(parseInt(appointments[i].date.split('.')[1]) == mountNumber && parseInt(appointments[i].date.split('.')[2]) == year)
				counter += appointments[i].serviceIds.length; // increase counter
		}
		return counter;
	}
	catch(err){
		return -1;
	}
}

// appointments - array 
// mountNumber - [1,12] number
// year - number
function CountAppointmentsInMonth(appointments, mountNumber,year){
	
	try{
		// save number of services in counter
		var counter = 0;
		// for each appointment
		for(var i=0; i < appointments.length; i++){
			// if appointment date match requirements
			if(parseInt(appointments[i].date.split('.')[1]) == mountNumber && parseInt(appointments[i].date.split('.')[2]) == year)
				counter += 1; // increase counter
		}
		return counter;
	}
	catch(err){
		return -1;
	}
}


// appointments - array 
// mountNumber - [1,12] number
// year - number
function CountClientsInMonth(appointments, mountNumber,year){
	
	try{
		// store all clients in array
		var clients = new Array();
		// for each appointment
		for(var i=0; i < appointments.length; i++){
			// if appointment date match requirements
			if(parseInt(appointments[i].date.split('.')[1]) == mountNumber && parseInt(appointments[i].date.split('.')[2]) == year)
				if(clients.indexOf(appointments[i].clientId) == -1) // if client is not in array
					clients.push(appointments[i].clientId); // add client to list
		}
		return clients.length;
	}
	catch(err){
		return -1;
	}
}

// appointments - array 
// mountNumber - [1,12] number
// year - number
function CountAppointmentHoursInMonth(appointments, mountNumber,year){
	
	try{
		// save number of services in counter
		var counter = 0;
		// for each appointment
		for(var i=0; i < appointments.length; i++){
			// if appointment date match requirements
			if(parseInt(appointments[i].date.split('.')[1]) == mountNumber && parseInt(appointments[i].date.split('.')[2]) == year)
				counter += DifferenceBetweenHours(appointments[i].date, appointments[i].start, appointments[i].end);
		}
		return counter;
	}
	catch(err){
		return -1;
	}
}

// start and end date are the same
function DifferenceBetweenHours(startDate, startTime, endTime){

	try{
		// craete start and end
		var start = new Date(parseInt(startDate.split('.')[2]), parseInt(startDate.split('.')[1]) - 1, parseInt(startDate.split('.')[0]), parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1]), 0, 0);
		var end = new Date(parseInt(startDate.split('.')[2]), parseInt(startDate.split('.')[1]) - 1, parseInt(startDate.split('.')[0]), parseInt(endTime.split(':')[0]), parseInt(endTime.split(':')[1]), 0, 0);

		return Math.abs(end - start) / 36e5;
	}
	catch(err){
		return -1;
	}	
}

// format number ( e.g. 1.5 -> 01:30)
function FormatTime(time){

	try{

		//get hours
		var hours = Math.floor(time);
		// format hours
		if(hours < 10)
			hours = '0' + hours;
		// get minutes
		var minutes = Math.round((time - Math.floor(time)) * 60);
		// format minutes
		if(minutes < 10)
			minutes = '0' + minutes;

		return hours + ':' + minutes;
	}
	catch(err){
		return -1;
	}
}

// get date today
function DateToday(){
	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; // January is 0
	var yyyy = today.getFullYear();

	if(dd < 10)
    	dd='0'+dd
	
	if(mm<10)
	    mm='0'+mm
	
	return dd + '.' + mm + '.' + yyyy + '.';
}

// set day today
function SetDateToday(){
	$('#today').text(DateToday());	
}

// show or hide zero element in counting working hours
function ShowHideZeros(hours,minutes){
	if(hours < 10)
		$('#wh-zero').show();
	else
		$('#wh-zero').hide();

	if(minutes < 10)
		$('#wm-zero').show();
	else
		$('#wm-zero').hide();
}

// get statistic for current month
function GetStats(){
	// update stats
	cntServices = CountSerivicesInMonth(company.appointments, month, year);
	cntClients = CountClientsInMonth(company.appointments, month, year);
	cntWorkingHours = FormatTime(CountAppointmentHoursInMonth(company.appointments, month, year));
	cntAppointments = CountAppointmentsInMonth(company.appointments, month, year);

	$('.current-date').text(monthNames[month - 1] + ', ' + year + '.');
	$('#cnt-services').animateNumber({ number:  cntServices});
	$('#cnt-clients').animateNumber({ number: cntClients});
	// $('#cnt-working-hours').text(cntWorkingHours);	
	ShowHideZeros(parseInt(cntWorkingHours.split(':')[0]),parseInt(cntWorkingHours.split(':')[1]))
	$('#cnt-wh').animateNumber({ number: parseInt(cntWorkingHours.split(':')[0])});
	$('#cnt-wm').animateNumber({ number: parseInt(cntWorkingHours.split(':')[1])});	
	$('#cnt-appointments').animateNumber({ number:  cntAppointments });
}

// check if time is after current time
function TimeAfterCurrent(date,time){
 
	try{

		var dateNow = DateToday(); // date today
		var today = new Date();
		var timeNow = today.getHours() + ':' + today.getMinutes(); // time now
		
		dateNow = new Date(dateNow.split('.')[2] + '-' + dateNow.split('.')[1] + '-' + dateNow.split('.')[0] + ' ' + timeNow + ':00');
		
		return dateNow < new Date(date.split('.')[2] + '-' + date.split('.')[1] + '-' + date.split('.')[0] + ' ' + time+ ':00')
	}
	catch(err){
		return false;
	}
}

// return services of appointment in string
function IncAppointmentServices(appointment){
	try{
		var str = '';	

		for(var i = 0; i < appointment['services'].length; i++)
			str += appointment['services'][i]['name'] + ', ';
		if(str.length > 2)
			str = str.substring(0, str.length - 2);

		return str;
	}
	catch(err){
		return 'Termin nije valjan.';
	}
}

function AddIncAppointemtsToHtml(appointments){
	
	try{

		// clear ul element
		$('#incAppointments').empty();

		var lastIndex = appointments.length;
		
		// display only first 10
		if (lastIndex > 10)
			lastIndex = 10;

		// for first 10 appointments
		for(var i = 0; i < lastIndex; i++){

			// create new lio element
			$('#incAppointments').append($('<li>', {
	            id: 'incApp-' + i
	        }));
			// create clock icon
			$('#incApp-' + i).append($('<i>', {
	            class: 'fa fa-clock-o'
	        }));

			// add time
			$('#incApp-' + i).append($('<p>', {
	            class: 'text incApp-time',
	            text: appointments[i]['start']
	        }));

	        // add client name
			$('#incApp-' + i).append($('<span>', {
	            class: 'text incApp-clientName',
	            text: appointments[i]['clientName']
	        }));

	        // create new li element
			$('#incApp-' + i).append($('<small>', {
	            class: 'text incApp-services',
	            text: IncAppointmentServices(appointments[i])
	        }));

	        var hoursFromNow = parseInt(FormatTime(appointments[i]['fromNow']).split(':')[0]);
	        var minutesFromNow = parseInt(FormatTime(appointments[i]['fromNow']).split(':')[1]);

	        var timeClass = 'label label-info';

	        if(hoursFromNow < 1 )
	        	timeClass = 'label label-danger';
	        else if(hoursFromNow == 1 && minutesFromNow > 0)
	        	timeClass = 'label label-warning';

	        // create new time from now element
			$('#incApp-' + i).append($('<small>', {
				id: '#incApp-fromNow-' + i,
	            class: timeClass,
	            text: FormatTime(appointments[i]['fromNow'])
	        }));
		}
	}
	catch(err){

		toastr.error('Nadolazeći termini se ne mogu prikazati.');
	}
}


// sort incoming appointments 
function GetIncAppointments(appointments){
	
	try{

		var incApp = new Array(); // store all incoming appointments in array
		var today = DateToday(); // date today

		// foreach appointment
		for(var i = 0; i < appointments.length; i++){
			if(TimeAfterCurrent(appointments[i].date,appointments[i].start) && parseInt(appointments[i].date.split('.')[0]) == parseInt(today.split('.')[0]) && parseInt(appointments[i].date.split('.')[1]) == parseInt(today.split('.')[1]) && parseInt(appointments[i].date.split('.')[2]) == parseInt(today.split('.')[2])){ // check 
				
				var newAppointment = appointments[i];
				// create time from now for sort
				newAppointment['fromNow'] = DifferenceBetweenHours(DateToday(), new Date().getHours() + ':' + new Date().getMinutes(), appointments[i]['start']);
				incApp.push(newAppointment); // push appointment in array
			}
		}
		// sort array
		incApp.sort(function(a, b) {
		    return parseFloat(a.fromNow) - parseFloat(b.fromNow);
		});

		AddIncAppointemtsToHtml(incApp);
	}
	catch(err){
		toastr.error('Nadolazeći termini se ne mogu dohvatiti.');
	}
	

}

// refresh incoming appointments
function RefreshIncAppointemts(){
	GetCalendarAppointments(GetIncAppointments,ServerError);
}

// refresh statistic
function RefreshStats(){

	// get new values
	var nCntServices = CountSerivicesInMonth(company.appointments, month, year);
	var nCntClients = CountClientsInMonth(company.appointments, month, year);
	var nCntWorkingHours = FormatTime(CountAppointmentHoursInMonth(company.appointments, month, year));
	var nCntAppointments = CountAppointmentsInMonth(company.appointments, month, year);

	// refresh
	if(cntServices != nCntServices){
		cntServices = nCntServices;
		$('#cnt-services').animateNumber({ number:  cntServices}); 
	}
	if(cntClients!= nCntClients){
		cntClients = nCntClients;
		$('#cnt-clients').animateNumber({ number: cntClients}); 
	}
	if(cntWorkingHours != nCntWorkingHours){
		cntWorkingHours = nCntWorkingHours; 
		// $('#cnt-working-hours').text(cntWorkingHours);
		ShowHideZeros(parseInt(cntWorkingHours.split(':')[0]),parseInt(cntWorkingHours.split(':')[1]))
		$('#cnt-wh').animateNumber({ number: parseInt(cntWorkingHours.split(':')[0])});
		$('#cnt-wm').animateNumber({ number: parseInt(cntWorkingHours.split(':')[1])});
	}
	if(cntAppointments != nCntAppointments){
		cntAppointments = nCntAppointments; 
		$('#cnt-appointments').animateNumber({ number:  cntAppointments });
	}
}



// update company in storage
function UpdateCompanyStorage(Company){
	// update storage
    localStorage.setItem('Company', JSON.stringify(Company));
    // update local variable
    company = JSON.parse(localStorage.getItem('Company'));
    
    // refresh stats
    RefreshStats();

    // refresh graph
    CreateGraph();
};


// Error functions //
function CompanyError(data){
    toastr.error('Podaci o tvrtci se ne mogu dohvatit.');
};

// Error from server
function ServerError(data){	
	toastr.error("Došlo je do pogreške prilikom dohvačanja podataka.");
}

function CreateGraph(appointments){

	var appointments = company.appointments;

	try{
		// create new array for counting services
		var tempServicesPerMonth = [0,0,0,0,0,0,0,0,0,0,0,0];

		// push 0 for every month
		for(var i = 0; i < 12; i++)
			tempServicesPerMonth.push(0);
		// count services for each month
		for(var i = 0; i < appointments.length; i++){
			if(parseInt(appointments[i].date.split('.')[2]) == year)
				tempServicesPerMonth[parseInt(appointments[i].date.split('.')[1]) - 1] += appointments[i].serviceIds.length;
		}	

		var refreshGraph = false;

		for(var i = 0; i < 12; i++){
			if(tempServicesPerMonth[i] != servicesPerMonth[i])
				refreshGraph = true;
		}

		if(refreshGraph){
			servicesPerMonth = tempServicesPerMonth;
		
			// INITIALIZE AREA CHART //

			// Get context with jQuery - using jQuery's .get() method.
		    var areaChartCanvas = $("#statsChart").get(0).getContext("2d");
		    // This will get the first returned node in the jQuery collection.
		    var areaChart = new Chart(areaChartCanvas);

		    var areaChartData = {
		      labels: monthNames,
		      datasets: [
		       
		        {
		          label: "Usluge",
		          fillColor: "rgba(60,141,188,0.9)",
		          strokeColor: "rgba(60,141,188,0.8)",
		          pointColor: "#3b8bba",
		          pointStrokeColor: "rgba(60,141,188,1)",
		          pointHighlightFill: "#fff",
		          pointHighlightStroke: "rgba(60,141,188,1)",
		          data: servicesPerMonth
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
		}
	}
	catch(err){
		toastr.error('Graf se ne može prikazati.');
	}
}

$(document).ready(function(){
	$('#todayYear').text(year);
	CreateGraph();
	RefreshIncAppointemts(); // get incoming appointments
	SetDateToday(); // set date today
	GetStats(); // get stats
});

window.setInterval(function(){
  GetCompany(UpdateCompanyStorage,CompanyError);
  RefreshIncAppointemts();
}, REFRESH_RATE);