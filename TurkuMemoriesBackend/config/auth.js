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

	const localRegister = new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'passwordhash',
			passReqToCallback: true
		},
		(req, email, passwordhash, next) => {
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

				User.create({ email: email, passwordhash: hashedPw }, (err, user) => {
					if (err) {
						console.log('Register : Error creating');
						return next(err);
					}

					console.log('Register : Success');
					next(null, user);
				});
			});
		}
	);

	passport.use('localRegister', localRegister);
};
