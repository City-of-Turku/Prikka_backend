/**
 * ROUTE
 * Login : /login endpoint
 * log the user using passport strategy(in auth.js)
 * 
 *  (post) : '/'
 */
const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/api/login');
const router = express.Router();



// login page
router.get('/', function(req, res) {
	res.render('login');
});

// authentication via google
router.get('/google', passport.authenticate('google', { scope: [ 'profile' ] }));

// router.get('/google-return', passport.authenticate('google', { failureRedirect: '/error' }), function(req, res) {
// });

router.get('/google-return', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
	// Successful authentication, redirect home.
	console.log("callback")
    res.redirect('/api/login/profile');
  });
// authentication via facebook
router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook-return', passport.authenticate('facebook', { failureRedirect: '/error' }), function(req, res) {
	res.redirect('/api/login/profile');
});

// move this someplace else
router.get('/profile', ensureLoggedIn, (req, res) => {
	console.log("saatana",req.user.dataValues)
	console.log("perkele",req.session)
	res.render('profile', { user: req.user.dataValues });
});
// debug remove later please
router.get('/secret', ensureLoggedIn, async (req, res) => {
	res.render('secret');
});
// logout --- deauthenticate
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
