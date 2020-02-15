/* ---------------------
 *       IMPORTS
 * --------------------- */

// Import libraries
const env = require('dotenv/config')

const bodyParser = require('body-parser')
const createError = require('http-errors')
const express = require('express')
const flash = require('connect-flash')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const logger = require('morgan')
var cors = require('cors')

//const db & models
const models = require('./models/index')
const db = require('./config/db').sequelize

require('./config/auth.js')(passport, models.User)

//Import routes
const loginRouter = require('./routes/login')
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const memoryRouter = require('./routes/memory')
const registerRouter = require('./routes/register')

/* ---------------------
 *         MAIN
 * --------------------- */

const app = express()

if (env.error) {
  console.error('FATAL ERROR: .env file is not defined')
  process.exit(1)
}

// database setup here
db.authenticate()
  .then(() => {
    console.log(
      'Connection has been established successfully.\n',
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

db.sync({ alter: true })
  .then(() => {
    console.log('Tables successfully synced.\n')
  })
  .catch(() => {
    console.error('Error syncing tables:', err, '\n')
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
app.use(
  session({
    secret: 'slfo0jr4u7djhe7e83_dhg',
    resave: true,
    saveUninitialized: true,
  }),
)

// Initialize Passport and restore authentication state, if any,= require (the
// session.
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(cors())
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
