/**
 * ROUTE
 * Login : /login endpoint
 * log the user using passport strategy(in auth.js)
 *
 *  (post) : '/'
 */
import express from 'express'
import passport from 'passport'
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn(
  '/api/auth-management/login',
)

export const loginRouter = express.Router()

// login page
loginRouter.get('/', function(req, res) {
  res.render('login')
})

// authentication via google
loginRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile'] }),
)

// loginRouter.get('/google-return', passport.authenticate('google', { failureRedirect: '/error' }), function(req, res) {
// });

loginRouter.get(
  '/google-return',
  passport.authenticate('google', {
    failureRedirect: '/login',
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('callback')
    res.redirect('/api/auth-management/login/profile')
  },
)
// authentication via facebook
loginRouter.get(
  '/facebook',
  passport.authenticate('facebook'),
)

loginRouter.get(
  '/facebook-return',
  passport.authenticate('facebook', {
    failureRedirect: '/error',
  }),
  function(req, res) {
    res.redirect('/api/auth-management/login/profile')
  },
)

// move this someplace else
loginRouter.get('/profile', ensureLoggedIn, (req, res) => {
  res.render('profile', { user: req.user.dataValues })
})
// debug remove later please
loginRouter.get(
  '/secret',
  ensureLoggedIn,
  async (req, res) => {
    res.render('secret')
  },
)
// logout --- deauthenticate
loginRouter.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

loginRouter.get('/login', (res, req) => {
  res.render('login')
})

loginRouter.post(
  '/login',
  passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/login',
  }),
)
