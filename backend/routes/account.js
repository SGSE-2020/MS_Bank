var express = require("express");
var router = express.Router();
var fs = require("fs");

const mongo = require('mongodb')
const DB_URL = 'mongodb://localhost'
const mongo_client = mongo.MongoClient;

router.get('/accountList', function(req, res, next) {
    var content = fs.readFileSync("routes/accountList.json");
    var jsonContent = JSON.parse(content);
    res.send(jsonContent);
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

router.get('/createAccount/:id', function(req, res, next) {
    var content;
    if (req.query.accountNr === "1"){
        content = fs.readFileSync("routes/accountDetails.json");  
    } else if(req.query.accountNr === "2"){
        content = fs.readFileSync("routes/accountDetails2.json"); 
    }
    var jsonContent = JSON.parse(content);
        res.send(jsonContent);
});

module.exports = router;