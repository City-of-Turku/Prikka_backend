/* ---------------------
 *       IMPORTS
 * --------------------- */

// Import libraries
const env = require('dotenv/config');

const bodyParser = require('body-parser');
const createError = require('http-errors');
const HttpStatus = require('http-status-codes');

const express = require('express');
const flash = require('connect-flash');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

//const db & models
const models = require('./models/index');
const db = require('./config/db').sequelize;
require('./config/auth.js')(passport);

//middleware
const userInViews = require('./middleware/userInViews')
const verifyToken = require('./middleware/verifyToken.js');
const verifyAdmin = require('./middleware/verifyAdmin');

//Import routes
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const memoryRouter = require('./routes/memory');
const categoryRouter = require('./routes/category');
const registerRouter = require('./routes/register');
const resetPasswordRouter = require('./routes/resetpassword');
const adminRouter = require('./routes/admin');

/* ---------------------
 *         MAIN
 * --------------------- */
const app = express();

if (env.error) {
	console.error('FATAL ERROR: .env file is not defined');
	process.exit(1);
}

// database setup here
db
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.\n');
	})
	.catch((err) => {
		console.error('Unable to connect to the database:', err);
	});

/*
 * User.sync() - This creates the table if it doesn't exist (and does nothing if it already exists)
 * User.sync({ force: true }) - This creates the table, dropping it first if it already existed
 * User.sync({ alter: true }) - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
 */

//TODO : issue, db.sync create new foreign keys each time
db
	.sync({ force: true })
	.then(() => {
		console.log('Tables successfully synced.\n');
	})
	.catch((err) => {
		console.error('Error syncing tables:', err, '\n');
	});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
// app.use(logger("combined"));
app.use(cookieParser());
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
var sess = {
	secret: 'slfo0jr4u7djhe7e83_dhg',
	cookie: {},
	resave: false,
	saveUninitialized: true
};

if (app.get('env') === 'production') {
	sess.cookie.secure = true;
}

app.use(session(sess))

app.use(helmet())

// Initialize Passport and restore authentication state, if any,= require (the
// session.

// move this to config/auth.js
// Configure Passport to use Auth0
// var strategy = new Auth0Strategy(
//   {
//     domain: process.env.AUTH0_DOMAIN,
//     clientID: process.env.AUTH0_CLIENT_ID,
//     clientSecret: process.env.AUTH0_CLIENT_SECRET,
//     callbackURL:
//       'https://localhost:4500/api/auth-management/callback'
//   },
//   function (accessToken, refreshToken, extraParams, profile, done) {
//     // accessToken is the token to call Auth0 API (not needed in the most cases)
//     // extraParams.id_token has the JSON Web Token
//     // profile has all the information from the user
//     return done(null, profile);
//   }
// );

// passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());

// passport.serializeUser(function (user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function (user, done) {
//   done(null, user);
// });

app.use(flash());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/auth-management', authRouter);
// app.use('/api/auth-management/register', registerRouter);
// app.use('/api/auth-management/resetPassword', resetPasswordRouter);
app.use('/api/memory-management', memoryRouter);
app.use('/api/admin/', [verifyToken, passport.authenticate('jwt', { session: false }), verifyAdmin], adminRouter);
app.use('/users', usersRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(HttpStatus.NOT_FOUND, 'Not found'));
});

// error handler
app.use((err, req, res, next) => {
	//set locals for dev
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	//set status for response
	res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR);
	// render the error page

	//res.render('error') //deactivated render, if not, the whole html page is send back as a response

	//create response body
	const data = {
		message: err.message,
		user: req.body
	};

	//send response ()
	res.send(data);

});

module.exports = app;
