function isLogged(){
  console.log(user_name);
  var panel = document.getElementById("main_panel");
  if(user_name === undefined){
    document.getElementById("login_view").style = "";
    document.getElementById("acc_view").style = "display: none;";
  }else{
    document.getElementById("login_view").style = "display: none;";
    document.getElementById("acc_view").style = "";
  }
}

function logoutChecker(){
  if(user_name !== undefined){
    document.getElementById("signinButton").hidden = true;
    document.getElementById("signoutButton").hidden = false;
  }else{
    document.getElementById("signinButton").hidden = false;
    document.getElementById("signoutButton").hidden = true;
  }
}
