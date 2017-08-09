 // VALIDATION //
$('#login-form').parsley();

	
$( document ).ready(function() {
	localStorage.setItem('Sidebar', 'off');
	var remember = $.cookie('remember');
	if ( remember == 'true' ) {
		var email = $.cookie('email');
		var password = $.cookie('password');
		// autofill the fields
		$('#email').val(email);
		$('#password').val(password);
		$('#remember').attr('checked', true);
	}
});
$('#company-login').click(function(e){
	 $('#login-form').parsley().validate();
        
    if ($('#login-form').parsley().isValid()) {
    
    	if ($('#remember').is(":checked") == true) {
			var email = $("#email").val(); 
			/*alert(email)*/
			var password = $("#password").val(); 
			// set cookies to expire in 14 days
			$.cookie("email", email);
			$.cookie('password', password, { expires: 14 });
			$.cookie('remember', true, { expires: 14 });
			/*alert( $.cookie('email') );
			console.log($.cookie('email'));*/
		} 
		else {
			// reset cookies
			$.cookie('email', null);
			$.cookie('password', null);
			$.cookie('remember', null);
			
		}
	    var data = {email: $('#email').val(),
	 				password: $('#password').val()}

	 	
		$.ajax({
		    type: 'POST',
		    url: ServerAddress + '/companyLogin',
		    crossDomain: true,
		    data: data,
		    dataType: 'json',
		    success: function(data, status, jqXHR) {
		        //console.log("data: ",data);
		        
		        // Save User into storage
				localStorage.setItem('User', JSON.stringify(data.User));
				// Save Company into storage
				localStorage.setItem('Company', JSON.stringify(data.Company));
				// Save Token into storage
				localStorage.setItem('Token', JSON.stringify(data.Token));
				// go to index
				window.location.href = Domain + '/Index.html';


		    },
		    error: function (data, status, errorThrown) {
		        /*console.log("data: ",data);*/
		        // Display an error toast, with a title
				toastr.error(JSON.parse(data.responseText).message, 'Pogreška');
		    }
		});
	}
});

$(document).keypress(function(e) {
	if(e.which == 13) {
		$("#company-login").click();
	}
});
