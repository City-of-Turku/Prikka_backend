const express = require('express');
const _ = require('lodash');
const usersRouter = express.Router();

/* GET users listing. */
usersRouter.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

usersRouter.get('/profile', function(req, res, next) {
	res.send(_.omit(req.user, [ 'passwordhash', 'googleId', 'facebookId' ]));
});

module.exports = usersRouter;
