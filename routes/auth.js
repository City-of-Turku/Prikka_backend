

var express = require('express');
var router = express.Router();
var passport = require('passport');
var dotenv = require('dotenv');
var util = require('util');
var url = require('url');
var querystring = require('querystring');
const HttpStatus = require('http-status-codes');


const authRouter = express.Router();

// Perform the login, after login Auth0 will redirect to callback
authRouter.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile'
}), function (req, res) {
  res.redirect('/');
});
// res.redirect(`${process.env['HOSTNAME']}:${process.env['FRONTEND_PORT']}`);

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
authRouter.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect(process.env['LOGIN_REDIRECT']); }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      res.redirect(process.env['FRONTEND_LOCATION']);
    });
  })(req, res, next);
});


authRouter.get('/logout', (req, res) => {
  req.logout();

  var returnTo = req.protocol + '://' + req.hostname;
  var port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }
  var logoutURL = new url.URL(
    util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN)
  );
  var searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL);
});

authRouter.get('/logged', (req, res) => {
  if (req.user) {
    res.status(HttpStatus.OK).json({
      message: 'User status',
      logged: true
    });
  } else {
    res.status(HttpStatus.OK).json({
      message: 'User status',
      logged: false
    });
  }
})

// // authentication via google
// loginRouter.get(
// 	'/google',
// 	passport.authenticate('google', {
// 		scope: [ 'profile', 'email' ],
// 		session: false,
// 		accessType: 'offline',
// 		approvalPrompt: 'force'
// 	})
// );

// loginRouter.get('/google-return', (req, res, next) => {
// 	passport.authenticate('google', { session: false }, (err, user, info) => {
// 		// Successful authentication
// 		if (err || _.isEmpty(req.user)) {
// 			console.log(err);
// 			return res.status(400).json({
// 				message: 'Something is not right',
// 				user: user
// 			});
// 		}
// 		user = _.pick(req.user, [ 'username' ]); // pick only the username from user object
// 		req.login(user, { session: false }, (err) => {
// 			if (err) {
// 				res.send(err);
// 			}
// 			// sign token with user object and secret string
// 			const token = jwt.sign(user, process.env['JWT_SECRET'], { expiresIn: '15min' });
// 			return res.status(200).json({
// 				message: 'Succesfully logged in',
// 				username: user.username,
// 				token: token
// 			});
// 		});
// 	})(req, res);
// });
// // authentication via facebook
// loginRouter.get(
// 	'/facebook',
// 	passport.authenticate('facebook', {
// 		scope: [ 'email' ]
// 	})
// );

// loginRouter.get('/facebook-return', (req, res, next) => {
// 	passport.authenticate('facebook', { session: false }, (err, user, info) => {
// 		// Successful authentication
// 		if (err || _.isEmpty(req.user)) {
// 			console.log(err);
// 			return res.status(400).json({
// 				message: 'Something is not right',
// 				user: user
// 			});
// 		}
// 		user = _.pick(req.user, [ 'username' ]); // pick only the username from user object
// 		req.login(user, { session: false }, (err) => {
// 			if (err) {
// 				res.send(err);
// 			}
// 			// sign token with user object and secret string
// 			const token = jwt.sign(user, process.env['JWT_SECRET'], { expiresIn: '15min' });
// 			return res.status(200).json({
// 				message: 'Succesfully logged in',
// 				username: user.username,
// 				token: token
// 			});
// 		});
// 	})(req, res);
// });

// loginRouter.post('/', function(req, res, next) {
// 	passport.authenticate('local-signin', { session: false }, (err, user, info) => {
// 		if (err || _.isEmpty(req.user)) {
// 			return res.status(400).json({
// 				message: 'Something is not right',
// 				user: user
// 			});
// 		}
// 		req.login(user, { session: false }, (err) => {
// 			if (err) {
// 				res.send(err);
// 			}
// 			const token = jwt.sign(user, process.env['JWT_SECRET'], { expiresIn: '15min' });
// 			return res.status(200).json({
// 				message: 'Succesfully logged in',
// 				username: user.username,
// 				token: token
// 			});
// 		});
// 	})(req, res);
// });

// // logout --- deauthenticate
// loginRouter.get('/logout', (req, res) => {
// 	req.logout();
// 	res.redirect('/');
// });

module.exports = authRouter;
