const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../models').User;

// function to be called while there is a new sign/signup
// We are using passport local signin/signup strategies for our app

module.exports = (passport) => {
	passport.serializeUser((user, done) => {
		done(null, user.dataValues.id);
	});

	passport.deserializeUser((id, done) => {
		User.findByPk(id).then((user, err) => {
            console.log(user);
            done(err, user)
        });
	});

	passport.use(
		new GoogleStrategy(
			// strat settings
			{
				clientID: process.env['GOOGLE_CLIENT_ID'],
				clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
				callbackURL: '/api/login/google-return'
			},
			function(accessToken, refreshToken, profile, done) {
				// passport callback function
				console.log(profile);
				User.findOrCreate({
					where: { googleId: profile.id },
					defaults: {
						googleId: profile.id,
						name: profile.displayName,
						email: 'asdo@asd.fi',
						passwordhash: 'asdasda'
					}
				}).then(([ user, created, error ]) => {
					return done(null, user);
				});
			}
		)
	);

	passport.use(
		new FacebookStrategy(
			{
				clientID: process.env['FACEBOOK_APP_ID'],
				clientSecret: process.env['FACEBOOK_APP_SECRET'],
				callbackURL: '/api/login/facebook-return'
			},
			function(accessToken, refreshToken, profile, done) {
				// passport callback function
				console.log("FACEBOOK",profile);
				User.findOrCreate({
					where: { facebookId: profile.id },
					defaults: {
						facebookId: profile.id,
						name: profile.displayName,
						email: 'asdo@asd.fiasdf',
						passwordhash: 'asdasda'
					}
				}).then(([ user, created, error ]) => {
					return done(null, user);
				});
			}
		)
	);

    //var User = user;
  
    passport.use('local-register', new LocalStrategy(
 
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        function(req, email, password, done) {
 
            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
 
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (user) {
 
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
                } else
                {
                    var userPassword = generateHash(password);
 
                    var data =
 
                        {
                            email: email,
                            password: userPassword, 
                            name: req.body.name
                        };
 
                    User.create(data).then(function(newUser, created) {
 
                        if (!newUser) {
 
                            return done(null, false);
 
                        }
 
                        if (newUser) {
 
                            return done(null, newUser);
 
                        }
 
                    });
 
                }
 
            });
 
        }
 
    ));
 
}