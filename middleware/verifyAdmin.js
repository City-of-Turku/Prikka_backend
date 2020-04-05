const _ = require('lodash')
// logger
const logger = require('../config/winston');

function checkAdmin(req, res, next) {
    if (_.isEmpty(req.user)) {
        logger.info(`User is ${req.user}`)
        return res.status(401).send('Not logged in')
    }
    if (req.user.admin) {
        logger.info('Admin user')
        next();
    } else {
        logger.info('Not an admin user');
        return res.status(403).send('Forbidden')
    }
}

module.exports = checkAdmin;