const _ = require('lodash')
// logger
const logger = require('../config/winston');

function checkAdmin(req, res, next) {
    if (_.isEmpty(req.user)) {
        logger.info(`User is not logged in`)
        return res.status(401).send('Not logged in') // this should never happen since secured() middleware checks this allready
    }
    if (req.user.admin) {
        logger.info(`${req.user.id} checked as admin`)
        next();
    } else {
        logger.info(`${req.user.id} is not an admin user`);
        return res.status(403).send('Forbidden')
    }
}

module.exports = checkAdmin;