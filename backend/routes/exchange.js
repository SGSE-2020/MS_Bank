var express = require("express");
var router = express.Router();

router.get('/exchange', function(req, res, next) {
    console.log("Exchange Route ausgeführt");
});

module.exports = router;