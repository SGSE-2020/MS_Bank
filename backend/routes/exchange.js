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
            return;
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
    var amount = parseFloat(req.body.amount).toFixed(2);
    var start_date = req.body.start_date;
    var dest_iban = req.body.dest_iban;
    var dest_uid;

    if(start_date == undefined){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        start_date = dd + '/' + mm + '/' + yyyy;
    }

    let all_result = db.db('ms-bank').collection("customer").find({}).toArray();
    console.log(all_result);
    var check_counter = 0;
    for(let i in all_result){
        for(let v in all_result[i].accounts){
            if(all_result[i].accounts[v].iban == own_iban){
                check_counter++;
                dest_balance = parseFloat(all_result[i].accounts[v].balance) + parseFloat(amount);
            }
            if(all_result[i].accounts[v].iban == dest_iban){
                check_counter++;
                dest_uid = all_result[i].user_id;
                own_balance = parseFloat(all_result[i].accounts[v].balance) - parseFloat(amount);
            }
        }
    }

    var status = true;
    var counter = 0;
    mongo_connect(res, (err, db) => {
        db.collection('customer').findOne({user_id: id}, (err, result) => {
            if (err || result == null) {
                res.status(404).send({'error': 'Kein Account mit der id: ' + id + ' gefunden'})
                status = false;
                return;
            } else {     
                for (var i in result.accounts){
                    if(result.accounts[i].iban == own_iban){
                        console.log("Account hat zugriff");
                        mongo_connect(res, (err, db) => {
                            db.collection("customer").updateOne({ "user_id": id, "accounts.iban": own_iban},
                                { $push:
                                   {
                                     "accounts.$.transfer": {
                                        "own_iban": own_iban,
                                        "purpose": req.body.purpose,
                                        "dest_name": req.body.dest_name,
                                        "dest_iban": dest_iban,
                                        "amount": "-" + amount,
                                        "start_date": start_date,
                                        "repeats": req.body.repeat  
                                     }          
                                   }
                                }
                             )
                            return;
                        })

                        mongo_connect(res, (err, db) => {
                            db.collection("customer").updateOne({ "user_id": id, "accounts.iban": dest_iban},
                                { $push:
                                   {
                                     "accounts.$.transfer": {
                                        "own_iban": dest_iban,
                                        "purpose": req.body.purpose,
                                        "dest_name": req.body.dest_name,
                                        "dest_iban": own_iban,
                                        "amount": amount,
                                        "start_date": start_date,
                                        "repeats": req.body.repeat  
                                     }          
                                   }
                                }
                             )
                            return;
                        })

                        mongo_connect(res, (err, db) => {
                            db.collection('customer').findOne({user_id: id, "accounts.iban": dest_iban}, (err, result) => {
                                if (err || result == null) {
                                    res.status(404).send({'error': 'Kein Account mit der id: ' + id + ' gefunden'})
                                    status = false;
                                    return;
                                } else { 
                                    for (i in result.accounts){
                                        if(result.accounts[i].iban == dest_iban){
                                            var dest_balance = parseFloat(result.accounts[i].balance) + parseFloat(amount);
                                            dest_balance = dest_balance.toFixed(2);
                                        }
                                    }

                                    console.log(dest_balance);
                                    mongo_connect(res, (err, db) => {
                                        db.collection("customer").updateOne({ "user_id": id, "accounts.iban": dest_iban},
                                            { $set:
                                               {
                                                 "accounts.$.balance": dest_balance                                              
                                               }
                                            }
                                         )
                                        return;
                                    })
                                 }
                                return;
                            })
                        })

                        mongo_connect(res, (err, db) => {
                            db.collection('customer').findOne({user_id: id, "accounts.iban": own_iban}, (err, result) => {
                                if (err || result == null) {
                                    res.status(404).send({'error': 'Kein Account mit der id: ' + id + ' gefunden'})
                                    status = false;
                                    return;
                                } else { 
                                    for (i in result.accounts){
                                        if(result.accounts[i].iban == own_iban){
                                            var own_balance = parseFloat(result.accounts[i].balance) - parseFloat(amount);
                                            own_balance = own_balance.toFixed(2);
                                        }
                                    }
                                    console.log(own_balance);

                                    mongo_connect(res, (err, db) => {
                                        db.collection("customer").updateOne({ "user_id": id, "accounts.iban": own_iban},
                                            { $set:
                                               {
                                                 "accounts.$.balance": own_balance                                              
                                               }
                                            }
                                         )
                                        return;
                                    })
                                 }
                                return;
                            })
                        })                    
                    }else {
                        counter++;
                        if(counter == result.accounts.length)
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