displayView = function(){
    // the code required to display a view
    if (localStorage.getItem("token") != null) {
        console.log("Showing profile view");
        var profile_view = document.getElementById("profile_view");
        document.getElementById("content").innerHTML = profile_view.innerHTML;
        openTab(localStorage.getItem("tab"));
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

// Function for checking if the new password is appropriate
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

// Function for changing the password
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

// Retrieves user data
getUserData = function(){

    var token = localStorage.getItem("token");
    var url = "/get-user-data-by-token/" + token;

    httpGet(url, function(response){
        return response.data;
    });
};

// Shows user content under Home
setUserContent = function(){

    data = getUserData();

    console.log(data);

    document.getElementById("personal-content").innerHTML = "First name: " + data.firstname + "<br>";
    document.getElementById("personal-content").innerHTML += "Family name: " + data.familyname + "<br>";
    document.getElementById("personal-content").innerHTML += "Gender: " + data.gender + "<br>";
    document.getElementById("personal-content").innerHTML += "City: " + data.city + "<br>";
    document.getElementById("personal-content").innerHTML += "Country: " + data.country + "<br>";
    document.getElementById("personal-content").innerHTML += "Email: " + data.email + "<br>";
};

// Function for handling sign ups
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

    /*var signUpObject = {email:email, password:pw_reg,
        firstname:first_name, familyname:family_name,
        gender:gender, city:city, country:country};*/

    var vars = "email_reg=" + email + "&password_reg=" + pw_reg +
        "&firstname=" + first_name + "&familyname=" + family_name +
        "&gender=" + gender + "&city=" + city + "&country=" + country;

    httpPost("/sign-up", vars, function(response){
        if (response.success){
            console.log("Sign up successful!");
        }else{
            console.log("Sign up unsuccessful!");
        }

        showSysMessage(response.message);
    });

    return false;

};

// Function for handling sign ins
signInHandler = function(){
    console.log("Hello World!");

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var vars = "email=" + email + "&password=" + password;

    httpPost("/sign-in", vars, function(response)
    {
        if (response.success) {
            console.log("Login success");
            var profile_view = document.getElementById("profile_view");
            localStorage.setItem("token", response.data);
            openTab("Home");
            displayView();
        } else {
            console.log("Login failed.");
            showSysMessage(response.message);
        }
    });

    return false;
};

// Function for signing out
signOut = function(){
    var token = localStorage.getItem("token");
    var response = serverstub.signOut(token);
    localStorage.removeItem("token");
    displayView();
};

// Function for showing messages from the system
showSysMessage = function(msg){
    document.getElementById("error-message").innerHTML = msg;
    document.getElementById("alert-container").style.display = "block";
};

// Function for posting messages
postMessage = function(msg, email){
    var token = localStorage.getItem("token");

    console.log("Posting wall message.");
    var response = serverstub.postMessage(token, msg, email);
    console.log(response.message);
};

// Post on own wall
postOnOwnWall = function(){
    var data = getUserData();
    var email = data.email;
    var msg = document.getElementById("pm").value;

    postMessage(msg, email);
};

// Post on friends wall
postOnFriendsWall = function(){
    var email = document.getElementById("email_search").value;
    var msg = document.getElementById("friend_pm").value;

    postMessage(msg, email);
};

// Show personal wall messages
showMessages = function(){
    var token = localStorage.getItem("token");
    url = "/get-user-messages-by-token/" + token;

    httpGet(url, function(response){
        var messages = response.data;
        var output = "";

        for(var i = 0; i < messages.length; i++){
            output += "<hr><p>" + messages[i].content + "</p>";
        }

        document.getElementById("personal-wall").innerHTML = output;
    });
};

// Browse friend
browseFriend = function () {
    var token = localStorage.getItem("token");
    var email = document.getElementById("email_search").value;
    usrUrl = "/get-user-data-by-email/" + token + email;

    httpGet(usrUrl, function (usrResponse) {
        if (usrResponse.success) {
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
            msgUrl = "/get-user-messages-by-email/ + token";
            httpGet(msgUrl, function (msgResponse) {
                var messages = msgResponse.data;
                var output = "";
                for (var i = 0; i < messages.length; i++) {
                    output += "<hr><p>" + messages[i].content + "</p>";
                }
                document.getElementById("friend-wall").innerHTML = output;
            });
        } else {
            showSysMessage(response.message);
        }
    });
};

// Display correct tab
openTab = function(tab){
    localStorage.setItem("tab", tab);
    switch(tab) {
        case "Home":
            document.getElementById("home-content").style.display = "block";
            document.getElementById("browse-content").style.display = "none";
            document.getElementById("account-content").style.display = "none";
            document.getElementById("home-tab").style.background = "black";
            document.getElementById("browse-tab").style.background = "none";
            document.getElementById("account-tab").style.background = "none";
            setUserContent();
            break;
        case "Browse":
            document.getElementById("home-content").style.display = "none";
            document.getElementById("browse-content").style.display = "block";
            document.getElementById("account-content").style.display = "none";
            document.getElementById("home-tab").style.background = "none";
            document.getElementById("browse-tab").style.background = "black";
            document.getElementById("account-tab").style.background = "none";
            break;
        case "Account":
            document.getElementById("home-content").style.display = "none";
            document.getElementById("browse-content").style.display = "none";
            document.getElementById("account-content").style.display = "block";
            document.getElementById("home-tab").style.background = "none";
            document.getElementById("browse-tab").style.background = "none";
            document.getElementById("account-tab").style.background = "black";
            break;
        default:
            break;
    }
};


// HTTP requests for GET and POST 
httpGet = function httpGet(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
};

httpPost = function httpPost(url, vars, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    };
    xmlHttp.open("POST", url);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send(vars);
};
