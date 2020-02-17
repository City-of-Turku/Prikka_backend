const express = require('express');
const passport = require('passport');
const HttpStatus = require('http-status-codes');

const registerRouter = express.Router();

/* --- ENDPOINTS --- */
/**
 * (post) : '/'
 * Register the user, then redirect to /account page
 */
registerRouter.get('/', (req, res) => {
    //res.render('register')
    res.send();
});

registerRouter.post(
    '/',
    passport.authenticate('local-register', {
        successRedirect: '/',
        failureRedirect: 'register',
        failureFlash: true,
    }),
    function(req, res) {
        console.log('callback');
        res.send();
    }
);

module.exports = registerRouter;
