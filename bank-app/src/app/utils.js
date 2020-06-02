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

function loginUser() {
    var email = $('#mail_signin').val();
    var password = $('#password_signin').val();

    if(email != undefined && email.length > 0 && password != undefined && password.length > 0){
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
            firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
                //Token zu Bürgerbüro senden -> Uid zurückbekommen -> Dann User validiert
                alert("Token ist:" + idToken);
                console.log(firebase.auth().currentUser);
                $('#user_loggedin').html(firebase.auth().currentUser.email);
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
        $('#user_loggedin').html("Keiner eingeloggt");

	}, function(error) {
		alert("Logout fehlgeschlagen");
	});
};



