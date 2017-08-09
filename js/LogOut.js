
$("#logOut").click(function () {
	localStorage.clear();
	// go to login page
	window.location.href = Domain + '/Login.html';
});