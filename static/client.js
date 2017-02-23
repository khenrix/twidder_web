displayView = function () {
    // the code required to display a view
    if (localStorage.getItem("token") != null) {
        console.log("Showing profile view");
        var profile_view = document.getElementById("profile_view");
        document.getElementById("content").innerHTML = profile_view.innerHTML;
        openTab(localStorage.getItem("tab"));
    } else {
        console.log("Showing welcome view");
        var welcome_view = document.getElementById("welcome_view");
        document.getElementById("content").innerHTML = welcome_view.innerHTML;
    }
};

window.onload = function () {
    //code that is executed as the page is loaded.
    //You shall put your own custom code here.
    //window.alert() is not allowed to be used in your implementation.
    displayView();
};

// Function for checking if the new password is appropriate
checkPassword = function (given_pw, given_pw_rep) {
    var pw_length = 5;
    given_pw_length = given_pw.length;

    if (given_pw === given_pw_rep && given_pw_length > pw_length) {
        return true;
    } else {
        showSysMessage("Given passwords must be the same and longer than 5 characters!");
        return false;
    }
};

// Function for changing the password
changePassword = function () {
    var old_password = document.getElementById("psw_old").value;
    var new_password = document.getElementById("psw_new").value;
    var new_password_rep = document.getElementById("psw_new_rep").value;

    if (checkPassword(new_password, new_password_rep)) {
        var token = localStorage.getItem("token");
        var url = "/change-password/" + token;
        var vars = "old_password=" + old_password + "&new_password=" + new_password;
        httpPost(url, vars, function (response) {
            showSysMessage(response.message);
            console.log(response.message);
        });
    }

    return false;
};

// Shows user content under Home
setUserContent = function () {

    var token = localStorage.getItem("token");
    var url = "/get-user-data-by-token/" + token;

    httpGet(url, function (response) {
        document.getElementById("personal-content").innerHTML = "<b>First name: </b>" + response.data.firstname + "<br>";
        document.getElementById("personal-content").innerHTML += "<b>Family name: </b>" + response.data.familyname + "<br>";
        document.getElementById("personal-content").innerHTML += "<b>Gender: </b>" + response.data.gender + "<br>";
        document.getElementById("personal-content").innerHTML += "<b>City: </b>" + response.data.city + "<br>";
        document.getElementById("personal-content").innerHTML += "<b>Country: </b>" + response.data.country + "<br>";
        document.getElementById("personal-content").innerHTML += "<b>Email:</b> " + response.data.email + "<br>";
    });
};

// Function for handling sign ups
signUpHandler = function () {

    var first_name = document.getElementById("first_name").value;
    var family_name = document.getElementById("family_name").value;
    var gender = document.getElementById("gender").value;
    var city = document.getElementById("city").value;
    var country = document.getElementById("country").value;
    var email = document.getElementById("email_reg").value;
    var pw_reg = document.getElementById("psw_reg").value;
    var pw_reg_rep = document.getElementById("psw_reg_rep").value;

    if (!checkPassword(pw_reg, pw_reg_rep)) {
        return false;
    }

    var vars = "email_reg=" + email + "&password_reg=" + pw_reg +
        "&firstname=" + first_name + "&familyname=" + family_name +
        "&gender=" + gender + "&city=" + city + "&country=" + country;

    httpPost("/sign-up", vars, function (response) {
        if (response.success) {
            console.log("Sign up successful!");
        } else {
            console.log("Sign up unsuccessful!");
        }

        showSysMessage(response.message);
    });

    return false;

};

// Function for handling sign ins
signInHandler = function () {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var vars = "email=" + email + "&password=" + password;

    httpPost("/sign-in", vars, function (response) {
        if (response.success) {
            console.log("Login success");
            console.log(response.data);
            // Socket data
            var socketData = {};
            socketData["action"] = "sign_in";
            socketData["token"] = response.data;
            socket(socketData);

            // Store token and display correct view and tab
            localStorage.setItem("token", response.data);
            displayView();
            openTab("Home");
        } else {
            console.log("Login failed.");
            showSysMessage(response.message);
        }
    });

    return false;
};


// Function for signing out
signOut = function () {
    var token = localStorage.getItem("token");
    url = "/sign-out/" + token;
    httpPost(url, null, function (response) {
        console.log(response.message);
    });
    localStorage.removeItem("token");
    displayView();
};

// Function for showing messages from the system
showSysMessage = function (msg) {
    document.getElementById("error-message").innerHTML = msg;
    document.getElementById("alert-container").style.display = "block";
};

// Function for posting messages
postMessage = function (msg, email) {
    var token = localStorage.getItem("token");
    console.log(token);
    console.log("Posting wall message.");

    var url = "/post-message/" + token;
    var vars = "content=" + msg + "&email=" + email;
    httpPost(url, vars, function (response) {
        console.log(response.message);
    });
};

// Post on own wall
postOnOwnWall = function () {
    var token = localStorage.getItem("token");
    var url = "/get-user-data-by-token/" + token;

    httpGet(url, function (response) {
        var data = response.data;
        var email = data.email;
        var msg = document.getElementById("pm").value;
        postMessage(msg, email);
    });
};


// Post on friends wall
postOnFriendsWall = function () {
    var email = document.getElementById("email_search").value;
    var msg = document.getElementById("friend_pm").value;

    postMessage(msg, email);
};

// Show personal wall messages
showMessages = function () {
    var token = localStorage.getItem("token");
    url = "/get-user-messages-by-token/" + token;

    httpGet(url, function (response) {
        var messages = response.data;
        var output = "";

        for (var i = 0; i < messages.length; i++) {
            output += "<hr><div id='holder_"+ i +"' ondrop='drop(event)' ondragover='allowDrop(event)' > <p id='msg_" + i + "' draggable='true' ondragstart='drag(event)'>" + messages[i][1] + "</p></div>";
        }
        output += "<hr>";
        document.getElementById("personal-wall").innerHTML = output;
    });
};

// Browse friend
browseFriend = function () {
    var token = localStorage.getItem("token");
    var email = document.getElementById("email_search").value;
    usrUrl = "/get-user-data-by-email/" + token + "/" + email;

    httpGet(usrUrl, function (usrResponse) {
        if (usrResponse.success) {
            console.log("Friend found!");

            // Show personal content
            var data = usrResponse.data;
            document.getElementById("friend-personal-content").innerHTML = "First name: " + data.firstname + "<br>";
            document.getElementById("friend-personal-content").innerHTML += "Family name: " + data.familyname + "<br>";
            document.getElementById("friend-personal-content").innerHTML += "Gender: " + data.gender + "<br>";
            document.getElementById("friend-personal-content").innerHTML += "City: " + data.city + "<br>";
            document.getElementById("friend-personal-content").innerHTML += "Country: " + data.country + "<br>";
            document.getElementById("friend-personal-content").innerHTML += "Email: " + data.email + "<br>";

            // Show messages
            msgUrl = "/get-user-messages-by-email/" + token + "/" + email;
            httpGet(msgUrl, function (msgResponse) {
                var messages = msgResponse.data;

                var output = "";
                for (var i = 0; i < messages.length; i++) {
                    output += "<hr><p>" + messages[i][1] + "</p>";
                }
                document.getElementById("friend-wall").innerHTML = output;
            });
        } else {
            showSysMessage(usrResponse.message);
        }
    });
};

// Display correct tab
openTab = function (tab) {
    localStorage.setItem("tab", tab);
    switch (tab) {
        case "Home":
            document.getElementById("home-content").style.display = "block";
            document.getElementById("browse-content").style.display = "none";
            document.getElementById("account-content").style.display = "none";
            document.getElementById("home-tab").classList.add("active");
            document.getElementById("browse-tab").classList.remove("active");
            document.getElementById("account-tab").classList.remove("active");
            setUserContent();
            break;
        case "Browse":
            document.getElementById("home-content").style.display = "none";
            document.getElementById("browse-content").style.display = "block";
            document.getElementById("account-content").style.display = "none";
            document.getElementById("home-tab").classList.remove("active");
            document.getElementById("browse-tab").classList.add("active");
            document.getElementById("account-tab").classList.remove("active");
            break;
        case "Account":
            document.getElementById("home-content").style.display = "none";
            document.getElementById("browse-content").style.display = "none";
            document.getElementById("account-content").style.display = "block";
            document.getElementById("home-tab").classList.remove("active");
            document.getElementById("browse-tab").classList.remove("active");
            document.getElementById("account-tab").classList.add("active");
            break;
        default:
            break;
    }

    return false;
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

// Socket function
socket = function socket(data) {
    var ws = new WebSocket("ws://127.0.0.1:5000/socket");

    ws.onopen = function() {
        ws.send(JSON.stringify(data));
    };

    ws.onmessage = function(serverResponse) {
        var response = JSON.parse(serverResponse.data);

        if (response.success){
            if (response.message == "sign_out"){
                signOut();
            } else if (response.message == "stats") {
                // Send live data
                update_charts(response.gender_ratio, response.message_ratio, response.session_ratio)
            }
        }
    };

    ws.onclose = function() {
        // Web Socket is closed?
    };
};

//Handle drag and drop events
allowDrop = function allowDrop(ev) {
    ev.preventDefault();
};

drag = function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
};

drop = function drop(ev) {
    ev.preventDefault();
    var data = document.getElementById(ev.dataTransfer.getData("text"));
    var parent_node = data.parentNode;
    var temp = document.getElementById(ev.target.id);
    parent_node.innerHTML = temp.parentNode.innerHTML;
    ev.target.innerHTML = data.innerHTML;
};