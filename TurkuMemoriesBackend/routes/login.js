/**
 * ROUTE
 * Login : /login endpoint
 * log the user using passport strategy(in auth.js)
 * 
 *  (post) : '/'
 */
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/api/login')
const router = express.Router();

const Models = require('../models');

// console.log(Models.User.findOrCreate());
passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/api/login/google-return'
    },
    function (accessToken, refreshToken, profile, cb) {
        Models.User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: "pölö@lööllö.com",
            passwordhash: "asdqsdasdasd"
            
        }, function (err, user) {
            return cb(err, user);
        });

        return cb(null, profile);
    }
    ));

passport.use(new FacebookStrategy({
    clientID: process.env['FACEBOOK_APP_ID'],
    clientSecret: process.env['FACEBOOK_APP_SECRET'],
    callbackURL: '/api/login/facebook-return'
    },
    function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }
    ));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
    cb(null, user);
});
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

// login page
router.get('/',
    function(req, res) {
        res.render('login')
    });

// authentication via google
router.get('/google',
    passport.authenticate('google', { scope: ['profile'] })
);

router.get('/google-return', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/api/login/profile');
});

// authentication via facebook
router.get('/facebook',
    passport.authenticate('facebook')
);

router.get('/facebook-return',
    passport.authenticate('facebook', { failureRedirect: '/error'}),
    function(req, res) {
        res.redirect('/api/login/profile');
});

// move this someplace else
router.get('/profile', ensureLoggedIn, (req, res) => {
        res.render('profile', {user: req.user});
});
// debug remove later please
router.get('/secret', ensureLoggedIn, async (req, res) => {
    res.render('secret');
});
// logout --- deauthenticate
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});

module.exports = router;
