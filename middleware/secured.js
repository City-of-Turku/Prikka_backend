// logger
const logger = require('../config/winston');

module.exports = function() {
	return function secured(req, res, next) {
		if (req.user) {
      		logger.info(`secured(): ${req.user.id} is logged in`)
			return next();
		}
		req.session.returnTo = req.originalUrl;
		logger.info(`User not logged in redirecting to login ${req.originalUrl} - ${req.method} - ${req.ip}`);
		res.redirect(process.env['LOGIN_REDIRECT']);
	};
};
