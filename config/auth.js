const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const GoogleStrategy = require('passport-google-oauth20')
  .Strategy
const FacebookStrategy = require('passport-facebook')
  .Strategy

const User = require('../models/Db').User

// function to be called while there is a new sign/signup
// We are using passport local signin/signup strategies for our app

module.exports = passport => {
  passport.serializeUser((user, done) => {
    console.log('serializeUser')
    done(null, user.dataValues.id)
  })

  passport.deserializeUser((id, done) => {
    console.log('deSerialieUser')
    User.findByPk(id).then((user, err) => {
      console.log(user)
      done(err, user)
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
      function(accessToken, refreshToken, profile, done) {
        // passport callback function
        console.log(profile)
        User.findOrCreate({
          where: { googleId: profile.id },
          defaults: {
            googleId: profile.id,
            name: profile.displayName,
            email: 'asdo@asd.fi',
            passwordhash: 'asdasda',
          },
        }).then(([user, created, error]) => {
          return done(null, user)
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
      function(accessToken, refreshToken, profile, done) {
        // passport callback function
        console.log('FACEBOOK', profile)
        User.findOrCreate({
          where: { facebookId: profile.id },
          defaults: {
            facebookId: profile.id,
            name: profile.displayName,
            email: 'asdo@asd.fiasdf',
            passwordhash: 'asdasda',
          },
        }).then(([user, created, error]) => {
          return done(null, user)
        })
      },
    ),
  )

  //var User = user;

  //Local Register
  passport.use(
    'local-register',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) {
        console.log('callback function start')
        var generateHash = function(password) {
          console.log('making hash')
          return bcrypt.hashSync(
            password,
            bcrypt.genSaltSync(8),
            null,
          )
        }
        console.log('looking for user in DB')
        User.findOne({
          where: {
            email: email,
          },
        }).then(function(user) {
          if (user) {
            return done(null, false, {
              message: 'That email is already taken',
            })
          } else {
            var userPassword = generateHash(password)

            var data = {
              email: email,
              passwordhash: userPassword,
              name: req.body.name,
            }
            console.log(data)
            console.log('making a new user since not found')
            User.create(data).then(function(
              newUser,
              created,
            ) {
              if (!newUser) {
                console.log('error with creating new user')
                return done(null, false)
              }

              if (newUser) {
                console.log('new user was created')
                return done(null, newUser)
              }
            })
          }
        })
      },
    ),
  )

  //Local login
  passport.use(
    'local-signin',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      (req, email, password, next) => {
        User.findOne({
          where: {
            email: email,
          },
        }).then((user, err) => {
          console.log('user', user)
          console.log('error', err)
          if (err) {
            console.log('Login :error')
            return next(err)
          }

          //If not found
          if (user == null) {
            console.log('Login : not found')
            return next(new Error('User not found'))
          }

          //If wrong password
          if (
            bcrypt.compareSync(
              password,
              user.dataValues.passwordhash,
            ) == false
          ) {
            console.log('Login :Wrong Password')

            return next(new Error('Incorrect password'))
          }

          //Else success
          console.log('Login: success')
          return next(null, user)
        })
      },
    ),
  )
}
