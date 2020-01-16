/**
 * ROUTE
 * Login : /login endpoint
 * log the user using passport strategy(in auth.js)
 * 
 *  (post) : '/'
 */
const express = require('express');
const passport = require('passport');
const Strategy = require('passport-google-oauth20').Strategy;
const router = express.Router();

passport.use(new Strategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/return'
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

router.get('/google',
    passport.authenticate('google', { scope: ['profile'] })
);

router.get('/return', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
});

module.exports = router;
