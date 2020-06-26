var express = require("express");
var router = express.Router();
var fs = require("fs");

const mongo = require('mongodb')
const DB_URL = 'mongodb://localhost'
const mongo_client = mongo.MongoClient;

function mongo_connect(res, callback) {
    mongo_client.connect(DB_URL, (err, db) => {
        if (err) {
            res.status(500).send({'error': err})
            console.error(err)
        }
        else {
            callback(err, db.db('ms-bank'))
            db.close()
        }
    })
}

router.get('/accountList', function(req, res, next) {
    var id = req.query.id;
    console.log(id);
    mongo_connect(res, (err, db) => {
        db.collection('customer').findOne({user_id: id}, (err, result) => {
            if (err || result == null) {
                res.status(404).send({'error': 'Kein Account mit der id: ' + id + ' gefunden'})
            } else {           
                res.send(result.accounts)
            }
        })
    })
});

router.get('/accountDetails', function(req, res, next) {
    var content;
    if (req.query.accountNr === "1"){
        content = fs.readFileSync("routes/accountDetails.json");  
    } else if(req.query.accountNr === "2"){
        content = fs.readFileSync("routes/accountDetails2.json"); 
    }
    var jsonContent = JSON.parse(content);
        res.send(jsonContent);
});

router.post('/createAccount', function(req, res, next) {
    var user_id = req.body.user_id;
    var iban = getIban();
    var account_description = req.body.description;

    if(req.body.advisor != true)
        var advisor_id = getAdvisor();

    var account = {};
    account["balance"] = "0";
    account["description"] = account_description;
    account["iban"] = iban;

    var customer = {};
    customer["user_id"] = user_id;
    customer["advisor_id"] = advisor_id;
    customer["accounts"] = [account];

    console.log(customer);

    mongo_connect(res, (err, db) => {
        db.collection("customer").insertOne(customer, (err, db_res) => {
            if (err) {
                res.status(500).send({'error': err})
            } else {
                res.send()
            }
        })
    })

    res.end("Ihr Account wurde erstellt. Ihre neue IBAN:" + iban);
});

function getAdvisor(){
    var advisor_nr = 1;
    // get customer with advisor = null
    return advisor_nr;
}

function getIban(){
    var land = "DE ";
    var ziffer = "23 ";
    var bank_code = "1520 0000 ";

    var first = getRandomInt(1000,9999);
    var second = getRandomInt(1000,9999);
    var last = getRandomInt(10,99);

    var account_code = first + " " + second + " " + last;
    var iban = land + ziffer + bank_code + account_code;

    //if iban vorhanden
    return iban;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = router;