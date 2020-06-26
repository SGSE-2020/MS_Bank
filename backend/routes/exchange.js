var express = require("express");
var router = express.Router();
var fs = require("fs");

router.get('/exchange', function(req, res, next) {
    res.send("hallo");
});

router.post('/createTransfer', function(req, res, next) {
    var id = req.body.user_id;
    var own_iban = req.body.iban;

    var transfer = {};
    transfer["own_iban"] = own_iban;
    transfer["purpose"] = req.body.purpose;
    transfer["dest_name"] = req.body.dest_name;
    transfer["dest_iban"] = req.body.dest_iban;
    transfer["amount"] = req.body.amount;
    transfer["start_date"] = req.body.start_date;
    transfer["repeats"] = req.body.repeat;

    var counter = 0;
    mongo_connect(res, (err, db) => {
        db.collection('customer').findOne({user_id: id}, (err, result) => {
            if (err || result == null) {
                res.status(404).send({'error': 'Kein Account mit der id: ' + id + ' gefunden'})
            } else {     
                for (var i in result.accounts){
                    if(result.accounts[i].iban == own_iban){
                        
                    }else {
                        counter++;
                        if(counter == result.accounts.length)
                            res.end("Sie haben keinen Zugriff auf das angegebene Konto");
                    }
                }
            }
        })
    })

    mongo_connect(res, (err, db) => {
        db.collection("accounts").insertOne(customer, (err, db_res) => {
            if (err) {
                res.status(500).send({'error': err})
            } else {
                res.send()
            }
        })
    })

    res.end("Ihr Account wurde erstellt. Ihre neue IBAN:" + iban);
});

module.exports = router;