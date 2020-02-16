const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const GoogleStrategy = require('passport-google-oauth20')
  .Strategy
const FacebookStrategy = require('passport-facebook')
  .Strategy

const models = require('../models/index')
const createError = require('http-errors')
const HttpStatus = require('http-status-codes')

// function to be called while there is a new sign/signup
// We are using passport local signin/signup strategies for our app

module.exports = passport => {
  passport.serializeUser((user, next) => {
    console.log('serializeUser')
    next(null, user)
  })

  passport.deserializeUser((id, next) => {
    console.log('deserializeUser')
    models.User.findByPk(id)
      .then(user => {
        if (user) {
          //found
          console.log('User found')
        } else {
          console.log('User not found')
        }
        next(null, user)
      })
      .catch(err => {
        console.log(err)
        next(err)
      })
  })

  //Google
  passport.use(
    new GoogleStrategy(
      // strat settings
      {
        clientID: process.env['GOOGLE_CLIENT_ID'],
        clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
        callbackURL:
          '/api/auth-management/login/google-return',
      },
      function(accessToken, refreshToken, profile, next) {
        // passport callback function
        console.log(profile)
        models.User.findOrCreate({
          where: { googleId: profile.id },
          defaults: {
            googleId: profile.id,
            username: profile.displayName,
            email: 'asdo@asd.fi',
            passwordhash: 'asdasda',
          },
        })
          .then(user => {
            return next(null, user)
          })
          .catch(err => {
            return next(err)
          })
      },
    ),
  )

  //Facebook
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env['FACEBOOK_APP_ID'],
        clientSecret: process.env['FACEBOOK_APP_SECRET'],
        callbackURL:
          '/api/auth-management/login/facebook-return',
      },
      function(accessToken, refreshToken, profile, next) {
        // passport callback function
        console.log('FACEBOOK', profile)
        models.User.findOrCreate({
          where: { facebookId: profile.id },
          defaults: {
            facebookId: profile.id,
            username: profile.displayName,
            email: 'asdo@asd.fiasdf',
            passwordhash: 'asdasda',
          },
        })
          .then(user => {
            return next(null, user)
          })
          .catch(err => {
            return next(err)
          })
      },
    ),
  )

  //var User = user;

  //Local Register
  //TODO : check if username already exists
  passport.use(
    'local-register',
    new LocalStrategy(
      {
        //get params from request
        usernameField: 'email', //do not change name 'usernameField', it's tied to library
        passwordField: 'password',
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      }, //care, order of params matters, same as up there
      (req, email, password, next) => {
        //Check If exists
        console.log('looking for user in DB')
        models.User.findOne({
          where: {
            email: email,
          },
        }).then(user => {
          // If exists
          if (user) {
            return next(
              createError(
                HttpStatus.CONFLICT,
                'That email is already taken',
              ),
            )
          }
          // If doesn't, create new user
          else {
            console.log(
              'trying to make a new user since not found',
            )
            const hashedPw = bcrypt.hashSync(password, 10)

            models.User.create({
              email: email,
              username: req.body.username,
              passwordhash: hashedPw,
            })

              .then(newUser => {
                //if successful
                if (newUser) {
                  console.log('new user was created')
                } else {
                  console.log(
                    'error with creating new user',
                  )
                }
                return next(null, newUser)
              })
              .catch(err => {
                return next(err)
              })
          } //end user create
        })
      }, //end callback localstrategy
    ),
  )

  //Local login
  passport.use(
    'local-signin',
    new LocalStrategy(
      {
        //get params from request
        usernameField: 'email', //do not change name 'usernameField', it's tied to library
        passwordField: 'password',
        passReqToCallback: true,
      }, //care, order of params matters, same as up there
      (req, email, password, next) => {
        console.log('Sign-in: findOne')
        models.User.findOne({
          where: {
            email: email,
          },
        }).then(user => {
          //found
          if (user) {
            console.log('Login : sucess')
            return next(null, newUser)
          }
          //If not found
          else if (user == null) {
            console.log('Login : user not found')
            return next(null, newUser)
          }
          //If wrong password
          else if (
            bcrypt.compareSync(
              password,
              user.dataValues.passwordhash,
            ) == false
          ) {
            console.log('Login :Wrong Password')
            return next(null, null)
          }
        })
      },
    ),
  )
}
