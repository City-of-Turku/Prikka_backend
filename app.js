/* ---------------------
 *       IMPORTS
 * --------------------- */

// Import libraries
import env from 'dotenv/config'

import bodyParser from 'body-parser'
import createError from 'http-errors'
import express from 'express'
import flash from 'connect-flash'
import path from 'path'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'
import passport from 'passport'
const logger = require('morgan')

//import db & models /!\ DO NOT CHANGE ORDER /!\
import { db } from './models/Db'

require('./config/auth.js')(passport, db.modUser)

//Import routes
import { loginRouter } from './routes/login'
import { indexRouter } from './routes/index'
import { usersRouter } from './routes/users'
import { memoryRouter } from './routes/memory'
import { registerRouter } from './routes/register'

/* ---------------------
 *         MAIN
 * --------------------- */

const app = express()

if (env.error) {
  console.error('FATAL ERROR: .env file is not defined')
  process.exit(1)
}

// database setup here
db.sequelize
  .authenticate()
  .then(() => {
    console.log(
      'Connection has been established successfully.',
    )
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

/*
 * User.sync() - This creates the table if it doesn't exist (and does nothing if it already exists)
 * User.sync({ force: true }) - This creates the table, dropping it first if it already existed
 * User.sync({ alter: true }) - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
 */

db.sequelize
  .sync({ alter: true })
  .then(function() {
    console.log('Nice! Database looks fine')
  })
  .catch(function(err) {
    console.log(
      err,
      'Something went wrong with the Database Update!',
    )
  })

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
// app.use(logger("combined"));
app.use(cookieParser())
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)
app.use(expressSession)

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/api/auth-management/login', loginRouter)
app.use('/api/auth-management/register', registerRouter)
app.use('/api/memory-management', memoryRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error =
    req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
