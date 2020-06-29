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

router.get('/exchange', function(req, res, next) {
    res.send("hallo");
});

router.post('/createTransfer', function(req, res, next) {
    console.log("CreateTransfer");
    var id = req.body.user_id;
    var own_iban = req.body.iban;
    var amount = req.body.amount;

    var status = true;
    var counter = 0;
    mongo_connect(res, (err, db) => {
        db.collection('customer').findOne({user_id: id}, (err, result) => {
            if (err || result == null) {
                res.status(404).send({'error': 'Kein Account mit der id: ' + id + ' gefunden'})
                status = false;
            } else {     
                for (var i in result.accounts){
                    if(result.accounts[i].iban == own_iban){
                        console.log("Account hat zugriff");
                        mongo_connect(res, (err, db) => {
                            db.collection("customer").update({ "user_id": id, "accounts.iban": own_iban},
                                { $push:
                                   {
                                     "accounts.$.transfer": {
                                        "own_iban": own_iban,
                                        "purpose": req.body.purpose,
                                        "dest_name": req.body.dest_name,
                                        "dest_iban": req.body.dest_iban,
                                        "amount": "-" + amount,
                                        "start_date": req.body.start_date,
                                        "repeats": req.body.repeat  
                                     }          
                                   }
                                }
                             )
                        })

                        mongo_connect(res, (err, db) => {
                            db.collection("customer").update({ "user_id": id, "accounts.iban": dest_iban},
                                { $push:
                                   {
                                     "accounts.$.transfer": {
                                        "own_iban": own_iban,
                                        "purpose": req.body.purpose,
                                        "dest_name": req.body.dest_name,
                                        "dest_iban": req.body.dest_iban,
                                        "amount": amount,
                                        "start_date": req.body.start_date,
                                        "repeats": req.body.repeat  
                                     }          
                                   }
                                }
                             )
                        })
                    }else {
                        counter++;
                        if(counter == result.accounts.size())
                            res.end("Sie haben keinen Zugriff auf das angegebene Konto");
                    }
                }
            }
        })
    })

    if(status)
        res.end("Die Überweisung war erfolgreich.");
});

module.exports = router;