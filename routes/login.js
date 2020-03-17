/**
 * ROUTE
 * Login : /login endpoint
 * log the user using passport strategy(in auth.js)
 *
 *  (post) : '/'
 */
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
var _ = require('lodash');

//middleware

const loginRouter = express.Router();

// authentication via google
loginRouter.get(
	'/google',
	passport.authenticate('google', {
		scope: [ 'profile', 'email' ],
		session: false,
		accessType: 'offline',
		approvalPrompt: 'force'
	})
);

loginRouter.get('/google-return', (req, res, next) => {
	passport.authenticate('google', { session: false }, (err, user, info) => {
		// Successful authentication
		if (err || _.isEmpty(req.user)) {
			console.log(err);
			return res.status(400).json({
				message: 'Something is not right',
				user: user
			});
		}
		user = _.pick(req.user, [ 'username' ]); // pick only the username from user object
		req.login(user, { session: false }, (err) => {
			if (err) {
				res.send(err);
			}
			// sign token with user object and secret string
			const token = jwt.sign(user, process.env['JWT_SECRET'], { expiresIn: '15min' });
			return res.status(200).json({
				message: 'Succesfully logged in',
				username: user.username,
				token: token
			});
		});
	})(req, res);
});
// authentication via facebook
loginRouter.get(
	'/facebook',
	passport.authenticate('facebook', {
		scope: [ 'email' ]
	})
);

loginRouter.get('/facebook-return', (req, res, next) => {
	passport.authenticate('facebook', { session: false }, (err, user, info) => {
		// Successful authentication
		if (err || _.isEmpty(req.user)) {
			console.log(err);
			return res.status(400).json({
				message: 'Something is not right',
				user: user
			});
		}
		user = _.pick(req.user, [ 'username' ]); // pick only the username from user object
		req.login(user, { session: false }, (err) => {
			if (err) {
				res.send(err);
			}
			// sign token with user object and secret string
			const token = jwt.sign(user, process.env['JWT_SECRET'], { expiresIn: '15min' });
			return res.status(200).json({
				message: 'Succesfully logged in',
				username: user.username,
				token: token
			});
		});
	})(req, res);
});

loginRouter.post('/', function(req, res, next) {
	passport.authenticate('local-signin', { session: false }, (err, user, info) => {
		if (err || _.isEmpty(req.user)) {
			return res.status(400).json({
				message: 'Something is not right',
				user: user
			});
		}
		req.login(user, { session: false }, (err) => {
			if (err) {
				res.send(err);
			}
			const token = jwt.sign(user, process.env['JWT_SECRET'], { expiresIn: '15min' });
			return res.status(200).json({
				message: 'Succesfully logged in',
				username: user.username,
				token: token
			});
		});
	})(req, res);
});

// logout --- deauthenticate
loginRouter.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = loginRouter;
