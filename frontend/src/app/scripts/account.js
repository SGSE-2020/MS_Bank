var amount_list = [];
var currency = " €";
var selected_account = 0;

function addAdvisor(){
  fetch(hostAdress + '/getAdvisor/inDZ2A0HCIf4nBltWmnLtJOgFRc2', {
    method: 'GET'
  }).then(response => {response.json(); console.log(response.json());})
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.error('Error:', error);
  });

}

function showAccountDetails(){
  var select = document.getElementById("account_select");
  var panel = document.getElementById("account_panel");
  var detail_template = document.getElementById("account_template").cloneNode(true);

  while (panel.firstChild) {
    panel.removeChild(panel.lastChild);
  }
  panel.appendChild(detail_template);

  addAccountDetailList(select.options[select.selectedIndex].value);

  if(amount_list[select.selectedIndex-1] < 0){
    document.getElementById("account_amount").classList.add("negativeAmount");
  }else {
    document.getElementById("account_amount").classList.add("positiveAmount");
  }
  document.getElementById("account_amount").innerHTML = amount_list[select.selectedIndex-1] + currency;
}

function addAccountDetailList(iban){
  fetch(hostAdress + '/accountDetails/'+iban+"/"+uid, {
    method: 'GET'
  }).then(response => response.json())
    .then(result => {
      console.log(result);
      var panel = document.getElementById("account_panel");
      document.getElementById("account_amount").innerHTML = result.balance + currency;

      var detail_template = document.getElementById("account_template");
      if(result.transfer != undefined){
        for (var i in result.transfer){
          var new_detail = detail_template.cloneNode(true);
          var date = new_detail.querySelector("#account_date").children[0];
          new_detail.hidden = false;
          new_detail.id = "";

          date.innerHTML = dateParser(result.transfer[i].start_date);

          if(result.transfer[i].amount < 0){
            new_detail.querySelector("#account_transfer_amount").children[0].classList.add("negativeAmount");
          }else {
            new_detail.querySelector("#account_transfer_amount").children[0].classList.add("positiveAmount");
          }
          new_detail.querySelector("#account_transfer_amount").children[0].innerHTML = result.transfer[i].amount + currency;

          new_detail.querySelector("#account_description").children[0].innerHTML = result.transfer[i].dest_name;
          new_detail.querySelector("#account_description").children[2].innerHTML = result.transfer[i].purpose;

          panel.appendChild(new_detail);
          panel.appendChild(document.createElement("hr"));
        }

        console.log('Success:', result);
      }
    })
    .catch(error => {
      console.error('Error:', error);
  });

  if(selected_account != 0){
    document.getElementById("account_select").value = selected_account;
  }
}

function dateParser(date){
  var date_array;

  if(date.includes("."))
    date_array = date.split(".");

  if(date.includes("/"))
    date_array = date.split("/");

  date_string = date_array[0];
  switch(date_array[1]){
    case "01":
        date_string = date_string + " Jan";
      break;
    case "02":
      date_string = date_string + " Feb";
      break;
    case "03":
      date_string = date_string + " März";
      break;
    case "04":
      date_string = date_string + " April";
      break;
    case "05":
      date_string = date_string + " Mai";
      break;
    case "06":
      date_string = date_string + " Juni";
      break;
    case "07":
      date_string = date_string + " Juli";
      break;
    case "08":
      date_string = date_string + " Aug";
      break;
    case "09":
      date_string = date_string + " Okt";
      break;
    case "10":
      date_string = date_string + " Sept";
      break;
    case "11":
      date_string = date_string + " Nov";
      break;
    case "12":
      date_string = date_string + " Dez";
      break;undefined
  }
  return date_string;
}

function addAccountSelect(){
  console.log(uid);
  var json = {};
  json["user_id"] = uid;
  
  fetch(hostAdress+'/accountList/' + uid, {
    method: 'GET'
  }).then(response => response.json())
    .then(result => {
      var select = document.getElementById("account_select");
      for (var i in result){
        var option = document.createElement("option");
        option.value = result[i].iban;
        option.text = result[i].description;
        amount_list.push(result[i].balance);
        select.add(option);
      }
    })
    .catch(error => {
      console.error('Error:', error);
  });
}

function addAccountToView(){
  console.log("Hallo");
  fetch(hostAdress+'/accountList/'+uid, {
    method: 'GET'
  }).then(response => response.json())
    .then(result => {
      if(result.error == undefined){
        var panel = document.getElementById("account_panel");
        if(panel != undefined){
          for (var i in result){
            var new_view = document.getElementById("account_view_template").cloneNode(true);
            new_view.hidden = false;
            new_view.id="";

            new_view.querySelector("#account_description").innerHTML = result[i].description;
            new_view.querySelector("#account_nr").innerHTML = result[i].iban;

            if(parseFloat(result[i].balance) < 0){
              new_view.querySelector("#account_amount").classList.add("negativeAmount");
            }else {
              new_view.querySelector("#account_amount").classList.add("positiveAmount");
            }
            new_view.querySelector("#account_amount").innerHTML = result[i].balance + currency;

            panel.appendChild(new_view);
          }
        }else{
          document.getElementById("createAccountPanel").hidden = false;
          document.getElementById("account_button").hidden = true;
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
  });
}

function createAccount(){
  var createObject = {};
  createObject["description"] = document.getElementById("new_account_description").value;
  createObject["user_id"] = uid;
  console.log(JSON.stringify(createObject))

  fetch(hostAdress + "/createAccount", {
    method: 'POST', 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createObject)
  }).then(response => response.text()
  ).then(response => {
    console.log(response);
    addAccountToView();
    document.getElementById("createAccountPanel").hidden = true;
  }).catch((error) => {
    console.error('Error:', error);
  });
}

function updateAccount(){
  var createObject = {};
  createObject["description"] = document.getElementById("new_account_description2").value;
  createObject["user_id"] = uid;
  console.log(JSON.stringify(createObject))

  fetch(hostAdress + "/updateAccount", {
    method: 'POST', 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createObject)
  }).then(response => response.text()
  ).then(response => {
    console.log(response);

  }).catch((error) => {
    console.error('Error:', error);
  });
}

function checkTransferInput(){
  var status = true;
  var error_msg = "";

  // Plicht
  var select = document.getElementById("account_select");
  var iban = select.options[select.selectedIndex].value;
  var porpose = document.getElementById("porpose").value;
  var dest_name = document.getElementById("dest_name").value;
  var dest_iban = document.getElementById("dest_iban").value;
  var amount =  document.getElementById("amount").value;

  //Optional
  var start_date = document.getElementById("start_date").value;
  var repeat_select = document.getElementById("repeatable_options");
  var repeat = repeat_select.options[repeat_select.selectedIndex].value;

  // Checkt alle wichtigen Eingaben
  if(dest_name==""){
    error_msg += "Es wurde kein Begünstigtenname angegeben. <br /> ";
    status = false;
  }
  if(iban==""){
    error_msg += "Die IBAN des Begünstigten nicht eingetragen. <br /> ";
    status = false;
  }
  if(amount==""){
    error_msg += "Es wurde kein Geldbetrag eingegeben. <br /> ";
    status = false;
  }
  if(amount<=0){
    error_msg += "Es wurde ein ungültiger Geldbetrag eingegeben. <br /> ";
    status = false;
  }
  if(porpose==""){
    error_msg += "Es wurde kein Verwendungszweck angegeben. <br /> ";
    status = false;
  }
  
  var createObject = {};
  createObject["user_id"] = uid;
  createObject["iban"] = iban;
  createObject["purpose"] = porpose;
  createObject["dest_name"] = dest_name;
  createObject["dest_iban"] = dest_iban;
  createObject["amount"] = amount;

  // Checkt alle Optionalen Eingaben
  if(start_date != ""){
    createObject["start_date"] = start_date;
  }

  if(repeat != "Bitte auswählen" && repeat != ""){
    createObject["repeat"] = repeat;
  }
  // existiert die iban überhaupt?

  if(status){
    createTransfer(createObject)
  }else
    alert(error_msg);
}

function createTransfer(createObject){
  console.log(JSON.stringify(createObject))

  fetch(hostAdress + "/createTransfer", {
    method: 'POST', 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createObject)
  }).then(response => response.text()
  ).then(response => {
    console.log(response);

  }).catch((error) => {
    console.error('Error:', error);
  });
}

function addAmount(){
  var amount = document.getElementById("add_amount").value;
  var select = document.getElementById("account_select");
  var iban = select.options[select.selectedIndex].value;

  if(amount == "")
    alert("Es wurde kein Betrag angeben");
  else if(iban == "Bitte wählen")
    alert("Es wurde kein Iban angeben");
  else{
    var createObject = {};
    createObject["amount"] = amount;
    createObject["iban"] = iban;
    createObject["userId"] = uid;

    fetch(hostAdress + "/addAmount", {
      method: 'POST', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createObject)
    }).then(response => response.text()
    ).then(response => {
      console.log(response);
  
    }).catch((error) => {
      console.error('Error:', error);
    });
  }
} 

function removeAccount(){
  fetch(hostAdress + "/remove/"+uid, {
    method: 'get'
  }).then(response => response.text()
  ).then(response => {
    console.log(response);

  }).catch((error) => {
    console.error('Error:', error);
  });

  logoutUser()
}