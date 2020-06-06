var express = require("express");
var router = express.Router();
var fs = require("fs");

router.get('/exchange', function(req, res, next) {
    res.send("hallo");
});


module.exports = router;