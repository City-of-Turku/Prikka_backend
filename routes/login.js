/**
 * ROUTE
 * Login : /login endpoint
 * log the user using passport strategy(in auth.js)
 *
 *  (post) : '/'
 */
// const env = require('dotenv/config');
const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/api/auth-management/login');
const jwt = require('jsonwebtoken');
var _ = require('lodash');

const loginRouter = express.Router();

// // login page
// loginRouter.get('/', function(req, res) {
//   //res.render('login')
//   res.send()
// })

// authentication via google
loginRouter.get('/google', passport.authenticate('google', { scope: [ 'profile' ] }));

loginRouter.get(
	'/google-return',
	passport.authenticate('google', {
		failureRedirect: '/'
	}),
	function(req, res) {
		// Successful authentication, redirect home.
		console.log('callback');
		res.redirect('/api/auth-management/login/profile');
	}
);
// authentication via facebook
loginRouter.get('/facebook', passport.authenticate('facebook'));

loginRouter.get(
	'/facebook-return',
	passport.authenticate('facebook', {
		failureRedirect: '/'
	}),
	function(req, res) {
		res.redirect('/api/auth-management/login/profile');
	}
);

// move this someplace else
loginRouter.get('/profile', (req, res) => {
	//res.render('profile', { user: req.user.dataValues })
	res.send();
});
// debug remove later please
// loginRouter.get('/secret', (req, res, next) => {
// 	//res.render('secret')
// 	res.send("secret shit");
// });
// logout --- deauthenticate
loginRouter.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

loginRouter.get('/', (res, req) => {
	//res.render('login')
	res.send();
});

loginRouter.post('/', function(req, res, next) {
	passport.authenticate('local-signin', { session: false }, (err, user, info) => {
        user = _.pick(user, ['username']); // pick only the username from user object
		if (err || _.isEmpty(user)) {
			return res.status(400).json({
				message: 'Something is not right',
				user: user
			});
        }
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }
            const token = jwt.sign(user['username'], process.env['JWT_SECRET']);
            return res.json({user, token});
        });
	})(req, res);
});

module.exports = loginRouter;
