/**
 * ROUTE
 * Register : /register endpoint
 * registering a new user
 * 
 *  (post) : '/'
 */


const express = require('express');
const passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');



/*passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({username: username}, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Invalid username or password'});
            }

            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Invalid username or password'});
            }
            

            return done(null, user)
        })
    }
));*/

// Register Strategy
passport.use(new LocalStrategy(
    function(name, email, passwordhash, next) {
        User.findOne({name: name}, (err, user) => { 
            // If Error
        if (err) {
            console.log('Register : error');
            return next(err);
        }

        // If found
        if (user != null) {
            console.log('Register : Already exists');
            return next(new Error('User already exists, please log in'));
        }

        // Else, Create new user
        const hashedPw = bcrypt.hashSync(passwordhash, 6);
        
        User.create({ name: name, email: email, passwordhash: hashedPw }, (err, user) => {
            if(err) {
                console.log('Register : Error Creating');
                return next(err);
            }

            console.log('Register : Success');
            next(null, user);
        });
    }); 


}));





router.post('/',
    passport.authenticate('local', { successRedirect: '/',
                                    failureRedirect: '/api/register',
                                    failureFlash: true })
);
router.get('/',(req, res) => {
    res.render('register');
});


module.exports = router;