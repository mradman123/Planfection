if(JSON.parse(localStorage.getItem('Token')) == null){
	// go to login page
	window.location.href = Domain + '/Login.html';
}