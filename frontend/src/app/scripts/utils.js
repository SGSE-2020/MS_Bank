var user;
var email;
var username;
var token;
var uid;
var lastname;

$(document).ready(function () {

    //Firebase Initialisierung
    var config = {
    	    apiKey: "AIzaSyBvTg0_QrhEvQ9UeZPH8--E2JZ55KA_u_c",
    	    authDomain: "smart-city-ss2020.firebaseapp.com",
    	    databaseURL: "https://smart-city-ss2020.firebaseio.com",
    	    projectId: "smart-city-ss2020",
    	    storageBucket: "smart-city-ss2020.appspot.com",
    	    messagingSenderId: "957240233717"
    };
    firebase.initializeApp(config);
});


/*
    geraldgeizig@bank.com
    geraldgeizig
*/
function loginUser() {
    var email = $('#mail_signin').val();
    var password = $('#password_signin').val();

    if(email != undefined && email.length > 0 && password != undefined && password.length > 0){
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
            firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
                //Token zu Bürgerbüro senden -> Uid zurückbekommen -> Dann User validiert

                fetch('https://buergerbuero.dvess.network/api/user/verify/' + idToken, {
                    method: 'POST'})
                    .then(response => response.json()).then(json => {
                    if (json && json.status == 'success') {
                        user = firebase.auth().currentUser
                        uid = user.uid;
                        email = user.email
                        username = user.displayName
                        token = idToken;
                        document.cookie = 'uid=' + uid + ';'

                        var login = document.getElementById("loginButton");
                        login.hidden = true;

                        var logout = document.getElementById("logoutButton");
                        logout.hidden = false;

                        var setting = document.getElementById("settingButton");
                        setting.innerHTML = username;
                        setting.hidden = false;

                        if(document.getElementById("login_view") !== null)
                        document.getElementById("login_view").style = "display: none;";
                        if(document.getElementById("acc_view") !== null)
                        document.getElementById("acc_view").style = "";
                        addAccountToView();
                        document.getElementById("signinButton").hidden = true;
                        document.getElementById("signoutButton").hidden = false;
                    } else {
                        alert("Dieser Nutzer konnte nicht verifiziert werden")
                    }
                }).catch((error) => {
                    console.log(error)
                    alert("Dieser Nutzer konnte nicht verifiziert werden")
                })
            }).catch(function(error) {
                console.log(error);
            });
        }, function(error) {
            if(error.code == "auth/invalid-email" || error.code == "auth/wrong-password" || error.code == "auth/user-not-found"){
                alert("E-Mail oder Passwort falsch oder User existiert nicht");
            } else if(error.code == "auth/user-disabled"){
                alert("Dieser Nutzer ist deaktiviert");
            } else {
                alert(error);
            }
        });
    } else {
        alert("Bitte Mail und Passwort eingeben");
    }


};

function logoutUser() {
	firebase.auth().signOut().then(function() {
		//Logout erfolgreich
        user_name = undefined;
        var login = document.getElementById("loginButton");
        login.hidden = false;
        var setting = document.getElementById("settingButton");
        setting.hidden = true;
        document.cookie = "token=;"
        var logout = document.getElementById("logoutButton");
        logout.hidden = true;

        document.getElementById("signinButton").hidden = false;
        document.getElementById("signoutButton").hidden = true;

        if(document.getElementById("login_view") !== null)
          document.getElementById("login_view").style = "";
        if(document.getElementById("acc_view") !== null)
          document.getElementById("acc_view").style = "display: none;";

	}, function(error) {
		alert("Logout fehlgeschlagen");
	});
};



