$('.sidebar-toggle').click(function (e) {
	// Save sidebar into storage
	var sidebar = localStorage.getItem('Sidebar');
	if(sidebar=='on')
	{
		localStorage.setItem('Sidebar', 'off');
	}
	
	else
	{
		localStorage.setItem('Sidebar', 'on');
	}
});


$( document ).ready(function() {
	var sidebar = localStorage.getItem('Sidebar');
	if(sidebar=='on')
	{
		$('body').addClass( "sidebar-collapse" );
	}
	
	else
	{
		$('body').removeClass( "sidebar-collapse" );
	}


});