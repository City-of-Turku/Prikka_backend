var appRoot = require('app-root-path');
var winston = require('winston');

var options = {
  combined_log: {
    level: 'info',
    filename: `${appRoot}/logs/turkumemories_combined.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  error_log: {
    level: 'error',
    filename: `${appRoot}/logs/turkumemories_error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
var logger = new winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.File(options.combined_log),
        new winston.transports.File(options.error_log),
        new winston.transports.Console(options.console)
    ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;