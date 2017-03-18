var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('chat.pug');
	res.end();
});

router.post('/', function(req, res) {
	res.render('chat.pug', { username: req.body.username} );
	res.end();
});

module.exports = router;
