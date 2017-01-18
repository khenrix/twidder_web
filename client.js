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
        showSysMessage("Given passwords must be the same and longer than 5 characters!");
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
        showSysMessage(response.message);
        console.log(response.message);
    }
};

getUserData = function(){

    var token = localStorage.getItem("token");
    return serverstub.getUserDataByToken(token).data;
};


setUserContent = function(){

    data = getUserData();

    document.getElementById("personal-content").innerHTML = "First name: " + data.firstname + "<br>";
    document.getElementById("personal-content").innerHTML += "Family name: " + data.familyname + "<br>";
    document.getElementById("personal-content").innerHTML += "Gender: " + data.gender + "<br>";
    document.getElementById("personal-content").innerHTML += "City: " + data.city + "<br>";
    document.getElementById("personal-content").innerHTML += "Country: " + data.country + "<br>";
    document.getElementById("personal-content").innerHTML += "Email: " + data.email + "<br>";
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

    showSysMessage(response.message);
};

signInHandler = function(){

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var response = serverstub.signIn(email, password);

    if (response.success){
        console.log("Login success");
        var profile_view = document.getElementById("profile_view");
        localStorage.setItem("token", response.data);
        showSysMessage(response.message);
        window.displayView();
    }else{
        console.log("Login failed.");
        showSysMessage(response.message);
    }
};

signOut = function(){
    var token = localStorage.getItem("token");
    var response = serverstub.signOut(token);

    localStorage.removeItem("token");
    window.displayView();
};

showSysMessage = function(msg){
    document.getElementById("error-message").innerHTML = msg;
    document.getElementById("alert-container").style.display = "block";
};

postMessage = function(msg, email){
    var token = localStorage.getItem("token");

    console.log("Posting wall message.");
    var response = serverstub.postMessage(token, msg, email);
    console.log(response.message);
};

postOnOwnWall = function(){
    var data = getUserData();
    var email = data.email;
    var msg = document.getElementById("pm").value;

    postMessage(msg, email);
};

postOnFriendsWall = function(){
    var email = document.getElementById("email_search").value;
    var msg = document.getElementById("friend_pm").value;

    postMessage(msg, email);
};

showMessages = function(){

    var token = localStorage.getItem("token");
    var messages = serverstub.getUserMessagesByToken(token).data;

    var output = "";
    for(var i = 0; i < messages.length; i++){
        output += "<hr><p>" + messages[i].content + "</p>";
    }
    console.log(output);

    document.getElementById("personal-wall").innerHTML = output;
};

browseFriend = function(){
    var token = localStorage.getItem("token");
    var email = document.getElementById("email_search").value;
    var response = serverstub.getUserDataByEmail(token, email);
    console.log(response);

    if (response.success){
        console.log("Friend found!");

        // Show personal content
        var data = response.data;
        document.getElementById("friend-personal-content").innerHTML = "First name: " + data.firstname + "<br>";
        document.getElementById("friend-personal-content").innerHTML += "Family name: " + data.familyname + "<br>";
        document.getElementById("friend-personal-content").innerHTML += "Gender: " + data.gender + "<br>";
        document.getElementById("friend-personal-content").innerHTML += "City: " + data.city + "<br>";
        document.getElementById("friend-personal-content").innerHTML += "Country: " + data.country + "<br>";
        document.getElementById("friend-personal-content").innerHTML += "Email: " + data.email + "<br>";

        // Show messages
        var messages = serverstub.getUserMessagesByEmail(token, email).data;
        console.log(messages)
        var output = "";
        for( var i = 0; i < messages.length; i++){
            output += "<hr><p>" + messages[i].content + "</p>";
        }
        document.getElementById("friend-wall").innerHTML = output;
    }else{
        showSysMessage(response.message);
    }
};




