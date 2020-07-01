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
            return;
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
                console.log("Error?" + err)
                res.send({'error': 'Kein Account mit der BenutzerID: ' + id})
                return;
            } else { 
                res.send(result.accounts)
                return;
            }
        })
        return;
    })
});

router.get('/removeDB', function(req, res, next) {
    mongo_connect(res, (err, db) => {
        db.collection('customer').remove()
        res.status(200);
        return;
    })
});

router.get('/remove/:uid', function(req, res, next) {
    var id = req.params.uid;

    mongo_connect(res, (err, db) => {
        db.collection('customer').remove({user_id: id})
        res.status(200);
        return;
    })
});

router.get('/db', (req, res) => {
    mongo_connect(res, (err, db) => {
        db.collection("customer").find({}).toArray((err, result) => {
            res.send(result)
        })
    })
})

router.get('/accountDetails/:iban/:uid', function(req, res, next) {
    var iban = req.params.iban;
    var uid = req.params.uid;

    mongo_connect(res, (err, db) => {
        db.collection('customer').findOne({user_id: uid}, (err, result) => {
            if (err || result == null) {
                res.status(404).send({'error': 'Kein Account mit der BenutzerID: ' + id})
                return;
            } else {       
                //res.status(404).send({'error': 'Kein Account mit der BenutzerID: ' + id})   
                for (i in result.accounts){
                    console.log("Account "+ i);
                    console.log(result.accounts[i])
                    if(result.accounts[i].iban == iban){
                        console.log(result.accounts[i])
                        res.send(result.accounts[i])
                        return;
                    }
                }
                
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
    account["balance"] = "1000"; // Neu Kunden Prämie
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
                return;
            } else {
                res.send()
                return;
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
    var advisor_id = "inDZ2A0HCIf4nBltWmnLtJOgFRc2";
    // get customer with advisor = null
    return advisor_id;
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