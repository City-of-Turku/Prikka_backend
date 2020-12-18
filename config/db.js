/**
 * Database module
 * Contains our connection/sequelize instance
 *
 * Database config in config.json
 */
const Sequelize = require('sequelize');
const config = require('./config.json');

// logger
const logger = require('../config/winston');

const env = process.env.NODE_ENV || 'development';
const params = config[env];
params['options']['logging'] = (msg) => logger.debug(msg); // better way to include this to options?
logger.info(`Initiliazing database connection with ${process.env['NODE_ENV']} parameters`);

//  config
const sequelize = new Sequelize(
    params.database,
    params.username,
    params.password,
    params.options,
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
