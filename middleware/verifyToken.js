const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    let token = req.headers.authorization.split(' ')[1];
    console.log(token)
    jwt.verify(token, process.env['JWT_SECRET'], function(err, decoded) {
        if (err) {
            console.log(err);
            return res.status(400).json({
                message: 'Token is shit',
                token: token,
            });
        } else {
            console.log('Token is not shit');
            next();
        }
    });
}

module.exports = verifyToken;
