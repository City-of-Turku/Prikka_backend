const Auth0Strategy = require('passport-auth0');

const models = require('../models/index');
const createError = require('http-errors');
const HttpStatus = require('http-status-codes');


const User = require('../models/user');

// function to be called while there is a new sign/signup
// We are using passport local signin/signup strategies for our app

module.exports = passport => {
    passport.use(
        new Auth0Strategy({
            domain: process.env.AUTH0_DOMAIN,
            clientID: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            callbackURL: 'https://localhost:4500/api/auth-management/callback',
        },
		function (accessToken, refreshToken, extraParams, profile, done) {
			// accessToken is the token to call Auth0 API (not needed in the most cases)
			// extraParams.id_token has the JSON Web Token
			// profile has all the information from the user
			console.log('ass estoken',accessToken)
			console.log('refreshtoken', refreshToken)
			console.log('extrae extra', extraParams)
			console.log('profile', profile)
			console.log('done', done)
			User.findOrCreate({
				where: {
					id: profile.id
				},
				defaults: {
					id: profile.id,
					displayName: profile.nickname,
					email: profile.emails[0].value,
					admin: false,
					provider: profile.provider
				}
			})
			.then(user => {
				profile['admin'] = user[0].dataValues.admin
				return done(null, profile);
			})
		}
	))
	passport.serializeUser(function (user, done) {
  		done(null, user);
	});

	passport.deserializeUser(function (user, done) {
  		done(null, user);
	});
};

    // passport.use(
    // 	new JWTStrategy(
    // 		{
    // 			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    // 			secretOrKey: process.env['JWT_SECRET']
    // 		},
    // 		function(jwtPayload, next) {
    // 			console.log(jwtPayload)
    // 			models.User
    // 				.findOne({
    // 					where: {
    // 						username: jwtPayload.username,
    // 					}
    // 				})
    // 				.then((user) => {
    // 					return next(null, user.dataValues);
    // 				})
    // 				.catch((err) => {
    // 					return next(err, false);
    // 				});
    // 		}
    // 	)
    // );

    // passport.serializeUser((user, next) => {
    // 	console.log('serializeUser');
    // 	next(null, user);
    // });

    // passport.deserializeUser((user, next) => {
    // 	console.log('deserializeUser', user);
    // 	models.User
    // 		.findByPk(user.id)
    // 		.then((user) => {
    // 			if (user) {
    // 				//found
    // 				console.log('User found');
    // 				console.log(user.dataValues);
    // 				next(null, user.dataValues);
    // 			} else {
    // 				console.log('User not found');
    // 				next(null, null);
    // 			}
    // 		})
    // 		.catch((err) => {
    // 			console.log(err);
    // 			next(err);
    // 		});
    // });

    //Google
    // passport.use(
    // 	new GoogleStrategy(
    // 		// strat settings
    // 		{
    // 			clientID: process.env['GOOGLE_CLIENT_ID'],
    // 			clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    //             callbackURL: '/api/auth-management/login/google-return',
    //             passReqToCallback: true
    // 		},
    // 		function(req, accessToken, refreshToken, profile, next) {
    // 			// passport callback function
    // 			console.log('GOOGLE', profile);
    // 			models.User
    // 				.findOrCreate({
    // 					where: { googleId: profile.id },
    // 					defaults: {
    // 						googleId: profile.id,
    // 						username: profile.displayName+'#GOOGLE',
    // 						email: 'GOOGLE#' + profile.emails[0].value,
    // 						passwordhash: 'noHash',
    // 						social_media_account: true,
    // 						admin: false
    // 					}
    // 				})
    // 				.then((user) => {
    //                     req.user = user[0].dataValues;
    // 					return next(null, user[0].dataValues);
    // 				})
    // 				.catch((err) => {
    // 					return next(err);
    // 				});
    // 		}
    // 	)
    // );

    //Facebook
    // passport.use(
    // 	new FacebookStrategy(
    // 		{
    // 			clientID: process.env['FACEBOOK_APP_ID'],
    // 			clientSecret: process.env['FACEBOOK_APP_SECRET'],
    //             callbackURL: '/api/auth-management/login/facebook-return',
    // 			passReqToCallback: true,
    // 			profileFields: ['id', 'emails', 'displayName']
    // 		},
    // 		function(req, accessToken, refreshToken, profile, next) {
    // 			// passport callback function
    // 			console.log('FACEBOOK', profile);
    // 			console.log(profile.displayName)
    // 			models.User
    // 				.findOrCreate({
    // 					where: { facebookId: profile.id },
    // 					defaults: {
    // 						facebookId: profile.id,
    // 						username: profile.displayName+'#FACEBOOK',
    // 						email: 'FACEBOOK#' + profile.emails[0].value,
    // 						passwordhash: 'noHash',
    // 						social_media_account: true,
    // 						admin: false
    // 					}
    // 				})
    // 				.then((user) => {
    //                     req.user = user[0].dataValues;
    // 					return next(null, user[0].dataValues);
    // 				})
    // 				.catch((err) => {
    // 					console.log(err)
    // 					return next(err);
    // 				});
    // 		}
    // 	)
    // );

    // //Local Register
    // //TODO : check if username already exists
    // passport.use(
    // 	'local-register',
    // 	new LocalStrategy(
    // 		{
    // 			//get params from request
    // 			usernameField: 'email', // do not change name 'usernameField', it's tied to library
    // 			passwordField: 'password',
    // 			passReqToCallback: true // allows us to pass back the entire request to the callback
    // 		}, // care, order of params matters, same as up there
    // 		(req, email, password, next) => {
    // 			//Check If exists
    // 			console.log('looking for user in DB');
    // 			models.User
    // 				.findOne({
    // 					where: {
    // 						email: email
    // 					}
    // 				})
    // 				.then((user) => {
    // 					// If exists
    // 					if (user) {
    // 						console.log('Cant register, user already exists');
    // 						console.log(user.dataValues);
    // 						return next(createError(HttpStatus.CONFLICT, 'That email is already taken'));
    // 					} else {
    // 						// If doesn't, create new user
    // 						console.log('trying to make a new user since not found');
    // 						const hashedPw = bcrypt.hashSync(password, 10);

    // 						models.User
    // 							.create({
    // 								email: email,
    // 								username: req.body.username,
    // 								passwordhash: hashedPw,
    // 								social_media_account: false,
    // 								admin: false
    // 							})
    // 							.then((newUser) => {
    // 								//if successful
    // 								if (newUser) {
    // 									console.log('new user was created');
    // 									console.log(newUser.dataValues);
    // 									return next(null, newUser.dataValues);
    // 								} else {
    // 									console.log('error with creating new user');
    // 									return next(null, null);
    // 								}
    // 							})
    // 							.catch((err) => {
    // 								return next(err);
    // 							});
    // 					} //end user create
    // 				});
    // 		} //end callback localstrategy
    // 	)
    // );

    // //Local login //TODO: Update strategies, suggest to bruteforce
    // passport.use(
    // 	'local-signin',
    // 	new LocalStrategy(
    // 		{
    // 			//get params from request
    // 			usernameField: 'email', //do not change name 'usernameField', it's tied to library
    // 			passwordField: 'password',
    // 			passReqToCallback: true
    // 		}, //care, order of params matters, same as up there
    // 		(req, email, password, next) => {
    // 			console.log('Sign-in: findOne');
    // 			models.User
    // 				.findOne({
    // 					where: {
    // 						email: email
    // 					}
    // 				})
    // 				.then((user) => {
    // 					//If not found
    // 					if (user == null) {
    // 						console.log('Login: User not found');
    // 						return next(null, null);
    // 					} else if (user.social_media_account) {
    // 						console.log('Login: User is trying to login with social media email')
    // 						return next(null, null)
    // 					} else if (bcrypt.compareSync(password, user.dataValues.passwordhash) == false) {
    // 						//If found, check password
    // 						console.log('Login: Wrong Password');
    // 						return next(null, null);
    // 					} else {
    // 						//found
    // 						console.log('Login: sucess');
    //                         console.log(user.dataValues);
    //                         req.user = user.dataValues
    // 						return next(null, user.dataValues);
    // 					}
    // 				});
    // 		}
    // 	)
    // );
