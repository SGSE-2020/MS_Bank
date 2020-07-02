const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
var exchange = require("./routes/exchange");
var account = require("./routes/account");

const mali = require('mali');
const grpc_module = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const cookieParser = require('cookie-parser');
const GRPC_PORT = 50051

const gRpcServer = new mali();
const accountProtoPath = path.resolve(__dirname, './proto/account.proto');
const advisorProtoPath = path.resolve(__dirname, './proto/advisor.proto');
const PORT = 8080;

const USER_PROTO = path.resolve(__dirname, './proto/user.proto');
const PACKAGE_DEFINITION = protoLoader.loadSync(
    USER_PROTO,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
)

const PCKG_DEF_OBJ = grpc_module.loadPackageDefinition(PACKAGE_DEFINITION)
const user_route = PCKG_DEF_OBJ.user

const mongo = require('mongodb')
const DB_URL = 'mongodb://localhost'
const mongo_client = mongo.MongoClient;

gRpcServer.addService(accountProtoPath, 'AccountService');

async function transfer (param) {
    //console.log(param.req);
    var id = param.req.userId;
    var own_iban = param.req.iban;
    var amount = parseFloat(param.req.amount).toFixed();
    var purpose = param.req.purpose;
    var start_date = param.req.startDate;
    var dest_iban = param.req.destIban;
    var repeat = param.req.repeat;

    var status = 200;
    var message = "Sie haben Geld an deinen Anderen Benutzer gesendet.";

    if(id == "" || own_iban == ""|| amount == "" || purpose == "" || dest_iban == ""){
        status = "404";
        message = "Eine der wichtigen Angaben Fehlt ihre Angaben: ";
    }else{
        var dest_name = "";
        var dest_uid;
        var dest_balance;
        var own_balance;

        if(start_date == undefined || start_date == ""){
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            start_date = dd + '/' + mm + '/' + yyyy;
        }

        let db = await mongo_client.connect(DB_URL);

        let all_result = await db.db('ms-bank').collection("customer").find({}).toArray();
        //console.log(all_result);
        var check_counter = 0;
        for(let i in all_result){
            for(let v in all_result[i].accounts){
                if(all_result[i].accounts[v].iban == own_iban){
                    console.log("own_iban found");
                    check_counter++;
                    dest_balance = (parseFloat(all_result[i].accounts[v].balance) + parseFloat(amount)).toFixed(2);
                }else if(all_result[i].accounts[v].iban == dest_iban){
                    console.log("dest_iban found");
                    check_counter++;
                    dest_name = all_result[i].accounts[v].description;
                    dest_uid = all_result[i].user_id;
                    own_balance = parseFloat(all_result[i].accounts[v].balance) - parseFloat(amount)
                    own_balance = parseFloat(own_balance).toFixed(2);
                }
            }
        }
        var counter = 0;
        if(check_counter == 2){
            
            let result = await db.db('ms-bank').collection("customer").findOne({user_id: id});   
            for (var i in result.accounts){
                if(result.accounts[i].iban == own_iban){
                    await db.db('ms-bank').collection("customer").updateOne({ "user_id": id, "accounts.iban": own_iban},
                    { $push:
                    {
                        "accounts.$.transfer": {
                            "own_iban": own_iban,
                            "purpose": purpose,
                            "dest_name": dest_name,
                            "dest_iban": dest_iban,
                            "amount": "-" + amount,
                            "start_date": start_date,
                            "repeats": repeat  
                        }          
                    }});

                    await db.db('ms-bank').collection("customer").updateOne({ "user_id": dest_uid, "accounts.iban": dest_iban},
                    { $push:
                        {
                            "accounts.$.transfer": {
                            "own_iban": dest_iban,
                            "purpose": purpose,
                            "dest_name": dest_name,
                            "dest_iban": own_iban,
                            "amount": amount,
                            "start_date": start_date,
                            "repeats": repeat  
                            }          
                        }});        

                    await db.db('ms-bank').collection("customer").updateOne({ "user_id": dest_uid, "accounts.iban": dest_iban},
                    { $set:
                        {
                                "accounts.$.balance": dest_balance                                              
                        }
                    });
                    
                    await db.db('ms-bank').collection("customer").updateOne({ "user_id": id, "accounts.iban": own_iban},
                    { $set:
                        {
                            "accounts.$.balance": own_balance                                              
                        }
                    });           
                }else {
                    console.log(result.accounts[i].iban + "==" +own_iban)
                    console.log(counter + "==" + result.accounts.length);
                    counter++;
                    if(counter == result.accounts.length){
                        message = "Der User hat keinen Zugriff auf das angegebene Konto";
                        status = 404;
                    }
                }
            }
        }else{
            status = 404 // Eicontainerne der Ibannummern wurde falsch angegeben.
            message = "Eine der Ibannummern wurde falsch angegeben."
        }
        
        await db.close();
    }

    param.res = {
        status: status,  // OK
        userId: id,
        lastname: "Husemann",
        message: message
    };
}

async function getIban (param) {
    var id = param.req.userId;
    let db = await mongo_client.connect(DB_URL);
    let result = await db.db('ms-bank').collection("customer").findOne({user_id: id});
    var iban;
    var status_msg;

    if(result != null){
        iban = result.accounts[0].iban;
        status_msg = "Konto gefunden";
    }else {
        status_msg = "Keine Konto verfügbar eingabe:" + id;
    }

    await db.close();
    param.res = {
        userId: id,
        iban: iban,
        status: status_msg
    }
}

function createAccount (param) {
    param.res = {
        user_id: "213",
        iban: "DE 4545 4544 5454 2555 20"       
    };
}

function deleteAccount (param) {
    param.res = {
        status: "200",   // OK
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

gRpcServer.use({ transfer, createAccount, deleteAccount, sendMessage, getIban });
gRpcServer.start("0.0.0.0:50051");

// Rest Service
var app = express();

app.use(cookieParser());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    if (req.hostname == 'localhost' || req.hostname == '127.0.0.1') {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
})

/*app.use('/', (req, res, next) => {
    console.log(req.cookies.token);
    if (res.cookies && res.cookies.uid) {
        res.status(400).send({'error': 'uid cookie not allowed'})
    } else {        
        user_token = {
            token: req.cookies.token
        }
        conn = new user_route.UserService('ms-buergerbuero:50051', grpc_module.credentials.createInsecure())
        conn.verifyUser(user_token, (err, feature) => {
            if (err) {
                res.status(401).send({'error': err})
            } else {
                if (feature.uid && feature.uid != "") {
                    req.cookies.uid = feature.uid
                    next()
                } else {
                    res.status(401).send({'error': 'Benutzerverifizierung fehlgeschlagen'})
                }
            }
        })
        
    }
})*/


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

app.listen(PORT, () => {
    console.log("Rest server gestartet");
});

// Database Connect Test

function mongo_connect(res, callback) {
    mongo_client.connect(DB_URL, (err, db) => {
        if (err) {
            res.status(500).send({'error': 'Unable to connect to database.'})
            console.error(err)
        }
        else {
            callback(err, db.db('ms-bank'))
            db.close()
        }
    })
}

app.get('/setupDB', (req, res) => {
    restaurant = {


        
    }
    mongo_connect(res, (err, db) => {
        db.collection(DB_RESTAURANTS).insertOne(restaurant, (err, db_res) => {
            if (err) {
                res.status(500).send({'error': err})
            } else {
                res.send()
            }
        })
    })
})
