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

router.get('/accountList/:uid', function(req, res, next) {
    var id = req.params.uid;
    console.log(id);
    mongo_connect(res, (err, db) => {
        db.collection('customer').findOne({user_id: id}, (err, result) => {
            if (err || result == null) {
                res.status(404).send({'error': 'Kein Account mit der BenutzerID: ' + id})
            } else {       
                //res.status(404).send({'error': 'Kein Account mit der BenutzerID: ' + id})
                console.log(result);  
                console.log("TransferList "+result.accounts[0].transfer[0].own_iban);      
                res.send(result.accounts)
            }
        })
    })
});

router.get('/removeDB', function(req, res, next) {
    mongo_connect(res, (err, db) => {
        db.collection('customer').remove()
        res.status(200);
    })
});

router.get('/accountDetails/:iban/:uid', function(req, res, next) {
    var iban = req.params.iban;
    var uid = req.params.uid;

    mongo_connect(res, (err, db) => {
        db.collection('customer').findOne({user_id: uid}, (err, result) => {
            if (err || result == null) {
                res.status(404).send({'error': 'Kein Account mit der BenutzerID: ' + id})
            } else {       
                //res.status(404).send({'error': 'Kein Account mit der BenutzerID: ' + id})   
                res.send(result.accounts)
            }
        })
    })
});

router.post('/createAccount', function(req, res, next) {
    var id = req.body.user_id;
    var iban = getIban();
    var account_description = req.body.description;

    if(req.body.advisor != true)
        var advisor_id = getAdvisor();

    var account = {};
    account["balance"] = "0";
    account["description"] = account_description;
    account["iban"] = iban;
    account["transfer"] = [];

    var customer = {};
    customer["user_id"] = id;
    customer["advisor_id"] = advisor_id;
    customer["accounts"] = [account];

    //console.log(customer);
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

router.post('/updateAccount', function(req, res, next) {
    var id = req.body.user_id;
    var account_description = req.body.description;
    var iban = getIban();
    var account = {};
    account["balance"] = "0";
    account["description"] = account_description;
    account["iban"] = iban;

    mongo_connect(res, (err, db) => {
        db.collection("customer").update({ user_id: id},
            { $addToSet:
               {
                 "accounts": account              
               }
            }
         )
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