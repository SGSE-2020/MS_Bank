var hostAdress = "http://localhost:8080";
var amount_list = [];
var currency = " €";

function showAccountDetails(){
  console.log("OnChange");
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

function addAccountDetailList(accountNr){
  fetch('http://localhost:8080/accountDetails?accountNr='+accountNr, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json'}
  }).then(response => response.json())
    .then(result => {
      var panel = document.getElementById("account_panel");

      var detail_template = document.getElementById("account_template");
      for (var i in result.list){
        var new_detail = detail_template.cloneNode(true);

        new_detail.hidden = false;
        new_detail.id = "";

        if(result.list[i].amount < 0){
          new_detail.querySelector("#account_transfer_amount").children[0].classList.add("negativeAmount");
        }else {
          new_detail.querySelector("#account_transfer_amount").children[0].classList.add("positiveAmount");
        }
        new_detail.querySelector("#account_transfer_amount").children[0].innerHTML = result.list[i].amount + currency;

        new_detail.querySelector("#account_description").children[0].innerHTML = result.list[i].dest_name;
        new_detail.querySelector("#account_description").children[2].innerHTML = result.list[i].purpose;

        panel.appendChild(new_detail);
        panel.appendChild(document.createElement("hr"));
      }
      console.log('Success:', result);
    })
    .catch(error => {
      console.error('Error:', error);
  });
}

function addAccountSelect(){
  fetch('http://localhost:8080/accountList', {
    method: 'GET'
  }).then(response => response.json())
    .then(result => {
      var select = document.getElementById("account_select");
      for (var i in result.list){
        var option = document.createElement("option");
        option.value = result.list[i].accountNr;
        option.text = result.list[i].description;
        amount_list.push(result.list[i].balance);
        select.add(option);
      }
    })
    .catch(error => {
      console.error('Error:', error);
  });
}
