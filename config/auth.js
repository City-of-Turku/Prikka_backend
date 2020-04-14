const Auth0Strategy = require('passport-auth0');
// logger
const logger = require('../config/winston');

const models = require('../models/index');
const createError = require('http-errors');
const HttpStatus = require('http-status-codes');

const User = require('../models/user');

// function to be called while there is a new sign/signup
// We are using passport local signin/signup strategies for our app

module.exports = passport => {
    passport.use(
        new Auth0Strategy(
            {
                domain: process.env.AUTH0_DOMAIN,
                clientID: process.env.AUTH0_CLIENT_ID,
                clientSecret: process.env.AUTH0_CLIENT_SECRET,
                callbackURL: process.env.AUTH0_CALLBACK_URL,
            },
            function(accessToken, refreshToken, extraParams, profile, done) {
                // accessToken is the token to call Auth0 API (not needed in the most cases)
                // extraParams.id_token has the JSON Web Token
                // profile has all the information from the user
                User.findOrCreate({
                    where: {
                        id: profile.id,
                    },
                    defaults: {
                        id: profile.id,
                        displayName: profile.nickname,
                        email: profile.emails[0].value,
                        admin: false,
                        provider: profile.provider,
                    },
                }).then(user => {
                    profile['admin'] = user[0].dataValues.admin;
                    return done(null, profile);
                });
            }
        )
    );
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
};
