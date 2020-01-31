const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
// function to be called while there is a new sign/signup 
// We are using passport local signin/signup strategies for our app

module.exports = (passport) => {

    passport.serializeUser((user, next) => {
        next(null, user);
    });

    passport.deserializeUser((id, next) => {
        User.findById(id, (err, user) => {
            next(err, user);
        })
    });

    const localRegister = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'passwordhash',
        passReqToCallback: true
    }, (req, email, passwordhash, next) => {
        User.findOne({ email: email }, (err, user) => {
            //If error
            if (err) {
                console.log('Register : error');
                return next(err);
            }

            //If found
            if (user != null) {
                console.log('Register : already exist');
                return next(new Error('User already exists, please log in.'));
            }

            //Else, Create new user
            const hashedPw = bcrypt.hashSync(passwordhash, 8);

            User.create({email: email, passwordhash: hashedPw,}, (err, user) => {
                if (err) {
                    console.log('Register : Error creating');
                    return next(err);
                }

                console.log('Register : Success');
                next(null, user);

            });

        });
    });

    passport.use('localRegister', localRegister);
};
