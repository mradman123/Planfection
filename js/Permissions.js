// get role of user
function GetRole(){
	try{
		return JSON.parse(localStorage.getItem('User')).role;
	}
	catch(err){
		return null;
	}
}

var ALLOWED_ROLES = ['AdministratorTvrtke'];

// check if user is allowed to access
function IsAllowed(){

	try{
		if(ALLOWED_ROLES.indexOf(GetRole()) > -1)
			return true;	
		return false;
	}
	catch(err){
		return false;
	}
}

function RedirectUser(){
	try{

		if(!IsAllowed())
			window.location = Domain + '/Index.html';
	}
	catch(err){
		window.location = Domain + '/Index.html';
	}
}

$(document).ready(function(){
	RedirectUser();
});