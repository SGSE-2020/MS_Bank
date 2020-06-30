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

function transfer (param) {
    param.res = {
        status: "200",  // OK
        user_id: "213",
        lastname: "Husemannn",
        message: "Sie haben Geld an deinen Anderen Benutzer gesendet."
    };
}

async function getIban (param) {
    var id = param.req.userId;
    let db = await mongo_client.connect(DB_URL);
    let result = await db.db('ms-bank').collection("customer").findOne({user_id: id});   
    if(result != null) 
        var iban = result.accounts[0].iban;
    else 
        iban = "Keine Konto verfügbar"

    await db.close();
    param.res = {
        userId: id,
        iban: iban
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
