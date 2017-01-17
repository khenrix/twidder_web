displayView = function(){
    // the code required to display a view
    if (localStorage.getItem("token") != null) {
        console.log("Showing profile view");
        var profile_view = document.getElementById("profile_view");
        document.getElementById("content").innerHTML = profile_view.innerHTML;
    }else{
        console.log("Showing welcome view");
        var welcome_view = document.getElementById("welcome_view");
        document.getElementById("content").innerHTML = welcome_view.innerHTML;
    }
};

window.onload = function(){
    //code that is executed as the page is loaded.
    //You shall put your own custom code here.
    //window.alert() is not allowed to be used in your implementation.
    displayView();
};

checkPassword = function(given_pw, given_pw_rep){
    var pw_length = 5;
    given_pw_length = given_pw.length;

    if (given_pw === given_pw_rep && given_pw_length > pw_length){
        return true;
    }else{
        showMessage("Given passwords must be the same and longer than 5 characters!");
        return false;
    }
};

changePassword = function(){

    var old_password = document.getElementById("psw_old").value;
    var new_password = document.getElementById("psw_new").value;
    var new_password_rep = document.getElementById("psw_new_rep").value;

    if (checkPassword(new_password, new_password_rep)){
        var token = localStorage.getItem("token");
        var response = serverstub.changePassword(token, old_password, new_password);
        showMessage(response.message);
        console.log(response.message);
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
        return;
    }

    var signUpObject = {email:email, password:pw_reg,
                        firstname:first_name, familyname:family_name,
                        gender:gender, city:city, country:country};

    var response = serverstub.signUp(signUpObject);

    if (response.success){
        console.log("Sign up successful!");
    }else{
        console.log("Sign up unsuccessful!");
    }

    showMessage(response.message);
};

signInHandler = function(){

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var response = serverstub.signIn(email, password);

    if (response.success){
        console.log("Login success");
        var profile_view = document.getElementById("profile_view");
        localStorage.setItem("token", response.data);
        showMessage(response.message);
        window.displayView();
    }else{
        console.log("Login failed.");
        showMessage(response.message);
    }
};

signOut = function(){
    var token = localStorage.getItem("token");
    var response = serverstub.signOut(token);

    localStorage.removeItem("token");
    window.displayView();
};

showMessage = function(msg){
    document.getElementById("error-message").innerHTML = msg;
    document.getElementById("alert-container").style.display = "block";
};