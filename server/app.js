const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const mali = require('mali');
var exchange = require("./routes/exchange");
const gRpcServer = new mali();
const accountProtoPath = path.resolve(__dirname, './proto/account.proto');
const advisorProtoPath = path.resolve(__dirname, './proto/advisor.proto');

/*Firebase Initialization
const firebase = require("firebase-admin");
const serviceAccount = require("./smartcity_servicekey.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://smart-city-ss2020.firebaseio.com"
});*/
//

// gRPC
gRpcServer.addService(accountProtoPath, 'AccountService');
gRpcServer.addService(advisorProtoPath, 'AdvisorService');

function transfer (param) {
    param.res = {
        status: "asdasd", 
        customerNr: "213",
        lastname: "Husemannn",
        message: "hallo"
    };
}

function createAccount (param) {
    param.res = {
        iban: "DE 4545 4544 5454 2555 20", 
        customerNr: "213"
    };
}

gRpcServer.use({ transfer });
gRpcServer.start("0.0.0.0:50051");

// Tests
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("hallo");
});

app.post("/", (req, res) => {
});

app.listen(3000, () => {
    console.log("Rest server gestartet");
});
