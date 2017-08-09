// all months
var Months = [{'title': 'Siječanj',
				 'value':'01'}, 
				{'title': 'Veljača',
				 'value':'02'},
				{'title': 'Ožujak',
				 'value':'03'},
				{'title': 'Travanj',
				 'value':'04'},
				{'title': 'Svibanj',
				 'value':'05'},
				{'title': 'Lipanj',
				 'value':'06'},
				{'title': 'Srpanj',
				 'value':'07'},
				{'title': 'Kolovoz',
				 'value':'08'},
				{'title': 'Rujan',
				 'value':'09'},
				{'title': 'Listopad',
				 'value':'10'},
				{'title': 'Studeni',
				 'value':'11'},
				{'title': 'Prosinac',
				 'value':'12'}];

function fillMonthOptions(){
	// foreach month
	for(var i = 0; i < Months.length; i++){
		// append option
		$('#month').append($('<option>', {
		    value: Months[i].value,
		    text: Months[i].title
		}));
	}
}

function fillYearOptions(){
	// get this year
	var thisYear = new Date().getFullYear();

	// foreach year from 2016 to this year
	for(var i = 2016; i < thisYear + 1; i++){
		// append option
		$('#year').append($('<option>', {
		    value: i,
		    text: i
		}));
	}
}

function selectCurrentMY(){
	var date = new Date();
	// select current month and year
	$("#month").val(date.getMonth() + 1).trigger("change");
	$("#year").val(date.getFullYear()).trigger("change");
}

// on document ready
$(document).ready(function(){
	
	fillMonthOptions();
	fillYearOptions();
	selectCurrentMY();

});