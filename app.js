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
const secured = require('./middleware/secured')
const verifyAdmin = require('./middleware/verifyAdmin');

//Import routes
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const memoryRouter = require('./routes/memory');
const categoryRouter = require('./routes/category');
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
db.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.\n');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

/*
 * User.sync() - This creates the table if it doesn't exist (and does nothing if it already exists)
 * User.sync({ force: true }) - This creates the table, dropping it first if it already existed
 * User.sync({ alter: true }) - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
 */

//TODO : issue, db.sync create new foreign keys each time
db.sync()
    .then(() => {
        console.log('Tables successfully synced.\n');
    })
    .catch(err => {
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
        extended: false,
    })
);
var sess = {
	secret: process.env['SESSION_SECRET'],
	cookie: {
		// httpOnly: true,
		maxAge: Number(process.env['SESSION_MAX_AGE'])
	},
	resave: false,
	saveUninitialized: true // create new session for all requests
};

if (app.get('env') === 'production') {
	sess.cookie.secure = true;
}

app.use(session(sess))

app.use(helmet())

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/auth-management', authRouter);
app.use('/api/memory-management', memoryRouter);
app.use('/api/admin/', [secured(), verifyAdmin], adminRouter);
app.use('/api/user-management', secured(), usersRouter);
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

	//create response body
	const data = {
		message: err.message,
		reqBody: req.body
	};

    //send response ()
    res.send(data);

});

module.exports = app;
