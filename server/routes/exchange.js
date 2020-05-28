var express = require("express");
var router = express.Router();

router.get('/exchange', function(req, res, next) {
    res.send('exchange api');
});

module.exports = router;