const _ = require('lodash')

function checkAdmin(req, res, next) {
    if (_.isEmpty(req.user)) {
        console.log(`User is ${req.user}`)
        return res.status(401).send('Not logged in')
    }
    if (req.user.admin) {
        console.log('Admin user')
        next();
    } else {
        console.log('Not an admin user');
        return res.status(403).send('Forbidden')
    }
}

module.exports = checkAdmin;