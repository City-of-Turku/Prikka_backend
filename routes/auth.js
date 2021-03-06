var express = require('express');
var router = express.Router();
var passport = require('passport');
var dotenv = require('dotenv');
var util = require('util');
var url = require('url');
var querystring = require('querystring');
const HttpStatus = require('http-status-codes');

// logger
const logger = require('../config/winston');

const authRouter = express.Router();

// Perform the login, after login Auth0 will redirect to callback
authRouter.get('/login',passport.authenticate('auth0', {
		scope: 'openid email profile'
	}),
	function(req, res) {
		res.redirect('/');
	}
);

// Perform the final stage of authentication and redirect to frontend
authRouter.get('/callback', function(req, res, next) {
	passport.authenticate('auth0', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.redirect(process.env['LOGIN_REDIRECT']);
		}
		req.logIn(user, function(err) {
			logger.info(
				`User ${user.id}, ${user.displayName} logged in. ${req.originalUrl} - ${req.method} - ${req.ip}`
			);
			if (err) {
				return next(err);
			}
			res.redirect(process.env['FRONTEND_LOCATION']);
		});
	})(req, res, next);
});

authRouter.get('/logout', (req, res) => {
	logger.info(`${req.user.id} logged out`);

	req.logout();

	var returnTo = process.env.FRONTEND_LOCATION;
	//var port = req.connection.localPort;
	//if (port !== undefined && port !== 80 && port !== 443) {
	//   returnTo += ':' + port;
	//}
	var logoutURL = new url.URL(util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN));
	var searchString = querystring.stringify({
		client_id: process.env.AUTH0_CLIENT_ID,
		returnTo: returnTo
	});
	logoutURL.search = searchString;

	res.redirect(logoutURL);
});

authRouter.get('/logged', (req, res) => {
	
	let isAdmin = false;
	let isLogged = false;

	try {
		if (req.user) {
			isLogged = true;

			if (req.user.admin) {
				isAdmin = true;
			}
		}
		logger.info(`Checking for logged in status. ${req.ip} - logged in:${isLogged} - admin: ${isAdmin}`);
		res.status(HttpStatus.OK).json({
			message: 'User status',
			isLogged: isLogged,
			isAdmin: isAdmin
		});
	} catch (err) {
		logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
	}
});


module.exports = authRouter;
