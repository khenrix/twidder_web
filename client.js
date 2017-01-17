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

checkPassword = function(){
    var pw_length = 5;
    given_pw = document.getElementById("psw_reg").value;
    given_pw_rep = document.getElementById("psw_reg_rep").value;
    given_pw_length = given_pw.length;
    console.log(given_pw_length);

    if (given_pw === given_pw_rep && given_pw_length > pw_length){
        return true;
    }else{
        window.alert("Given passwords must be the same and longer than 5 characters!")
    }
}