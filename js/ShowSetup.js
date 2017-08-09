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

function ShowSetup(){
	try{

		if(IsAllowed())
			$('.company-admin-permission').show();
	}
	catch(err){
		toastr.error('Došlo je do pogreške prilikom utvrđivanja uloge korisnika.');
	}
}

$(document).ready(function(){
	ShowSetup();
});