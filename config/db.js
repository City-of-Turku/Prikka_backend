/**
 * Database module
 * Contains our connection/sequelize instance
 *
 * Database config in config.json
 */
const Sequelize = require('sequelize');
const config = require('./config.json');

const env = process.env.NODE_ENV || 'development';
const params = config[env];
console.log(params);

//  config
const sequelize = new Sequelize(
    params.database,
    params.username,
    params.password,
    params.options
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
