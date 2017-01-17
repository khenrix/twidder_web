displayView = function(view){
    // the code required to display a view
    document.getElementById("content").innerHTML = view.innerHTML;
};

window.onload = function(){
    //code that is executed as the page is loaded.
    //You shall put your own custom code here.
    //window.alert() is not allowed to be used in your implementation.
    var welcome_view = document.getElementById("welcome_view");
    displayView(welcome_view);
};

checkPassword = function(given_pw, given_pw_rep){
    var pw_length = 5;
    given_pw_length = given_pw.length;
    console.log(given_pw_length);

    if (given_pw === given_pw_rep && given_pw_length > pw_length){
        return true;
    }else{
        window.alert("Given passwords must be the same and longer than 5 characters!")
        return false;
    }
};

signUpHandler = function(){

    var first_name = document.getElementById("first_name").value;
    var family_name = document.getElementById("family_name").value;
    var gender = document.getElementById("gender").value;
    var city = document.getElementById("city").value;
    var country = document.getElementById("country").value;
    var email = document.getElementById("email_reg").value;
    var pw_reg = document.getElementById("psw_reg").value;
    var pw_reg_rep = document.getElementById("psw_reg_rep").value;

    if (!checkPassword(pw_reg, pw_reg_rep)){
        return false;
    }

    var dataObject = {email:email, password:pw_reg, firstname:first_name, familyname:family_name,
                      gender:gender, city:city, country:country};

    var response = serverstub.signUp(dataObject);

    if (response.success){
        window.alert("Welcome to Twidder!");
        //displayView("profile_view");
    }else{
        window.alert(response.message);
    }
};