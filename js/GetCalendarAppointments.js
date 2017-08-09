 function GetCalendarAppointments (success, error) {
    var companyId = JSON.parse(localStorage.getItem('Company'))._id;
    var data ={
        CompanyId: companyId
    }
    $.ajax({
        type: "GET",
        url: ServerAddress + "/api/getCalendarAppointments?token=" + JSON.parse(localStorage.getItem('Token')),
        data: data,
        crossDomain: true,
        dataType: 'json',                       
        success: function (Appointments) {                    
           success(Appointments);
           
            
        },
        error: function (passParams) {
            error(passParams);
            //console.log("Dogodio se fatalni ERROR!");
        }
    });

};