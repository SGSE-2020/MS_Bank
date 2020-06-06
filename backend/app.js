const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const mali = require('mali');
var exchange = require("./routes/exchange");
var account = require("./routes/account");
const gRpcServer = new mali();
const accountProtoPath = path.resolve(__dirname, './proto/account.proto');
const advisorProtoPath = path.resolve(__dirname, './proto/advisor.proto');
const PORT = 8080;
var cors = require('cors');

/*Firebase Initialization
const firebase = require("firebase-admin");
const serviceAccount = require("./smartcity_servicekey.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://smart-city-ss2020.firebaseio.com"
});*/
//

// gRPC AccountService
gRpcServer.addService(accountProtoPath, 'AccountService');

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
        customerNr: "213",
        iban: "DE 4545 4544 5454 2555 20"       
    };
}

function deleteAccount (param) {
    param.res = {
        status: "OK", 
        message: "Ihr Account wurde gelöscht."
    };
}

// AdvisorService
gRpcServer.addService(advisorProtoPath, 'AdvisorService');

function sendMessage (param) {
    param.res = {
        message: "Ein Berater wird sie Kontaktieren"
    };
}

gRpcServer.use({ transfer, createAccount, deleteAccount, sendMessage });
gRpcServer.start("0.0.0.0:50051");

// Rest Service
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", exchange);
app.use("/", account);
app.get("/", (req, res) => {
    res.send("hallo");
});

app.get("/konto", (req, res) => {

    var content = fs.readFileSync("test_json.json");
    var jsonContent = JSON.parse(content);
    res.send(jsonContent);
});

app.post("/", (req, res) => {
});

app.listen(PORT, () => {
    console.log("Rest server gestartet");
});
