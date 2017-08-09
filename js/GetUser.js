$( document ).ready(function() {

	var user = JSON.parse(localStorage.getItem('User'));

	$(".user_name").text(user.firstName + " " + user.lastName);
    $('.profile-img').initial({name:user.firstName, width: 16, height: 16, fontSize: 10, fontWeight: 100});
    $('.profile1-img').initial({name:user.firstName, width: 90, height: 90, fontSize: 50, fontWeight: 700});
    $('.user-img').initial({name:user.firstName, width: 45, height: 45, fontSize: 24, fontWeight: 700});

	
});

function GetUser (success, error) {
    var userId = JSON.parse(localStorage.getItem('User'))._id;
    var data ={
        UserId: userId
    }
    $.ajax({
        type: "GET",
        url: ServerAddress + "/api/getUserById?token=" + JSON.parse(localStorage.getItem('Token')),
        data: data,
        crossDomain: true,
        dataType: 'json',                       
        success: function (User) {          
           success(User);
           
            
        },
        error: function (passParams) {
            error(passParams);
        }
    });

};
