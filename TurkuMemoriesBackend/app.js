const env = require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const flash = require('connect-flash');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser').urlencoded({ extended: true });
const expressSession = require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true });
const passport = require('passport');
const Sequelize = require('sequelize');

const loginRouter = require('./routes/login')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const memoryRouter = require('./routes/memory');
const registerRouter = require('./routes/register');


const app = express();

if (env.error) {
  console.error('FATAL ERROR: .env file is not defined');
  process.exit(1);
}

// database setup here
const sequelize = new Sequelize(
  process.env['DATABASE_USER'],
  process.env['DATABASE_USER'],
  process.env['DATABASE_PASSWORD'], {
  host: 'remotemysql.com', 
  dialect: 'mysql'
});
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to database OK');
  })
  .catch(err => {
    console.error('No connection to database');
  })


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
// app.use(logger("combined"));
app.use(cookieParser());
app.use(bodyParser);
app.use(expressSession);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);
app.use('/api/memory', memoryRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
