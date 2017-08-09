 function GetCompany (success, error) {
    var companyId = JSON.parse(localStorage.getItem('Company'))._id;
    var data ={
        CompanyId: companyId
    }
    $.ajax({
        type: "GET",
        url: ServerAddress + "/api/getCompanyById?token=" + JSON.parse(localStorage.getItem('Token')),
        data: data,
        crossDomain: true,
        dataType: 'json',                       
        success: function (Company) {            
           success(Company);
           
            
        },
        error: function (passParams) {
            error(passParams);
        }
    });

};





