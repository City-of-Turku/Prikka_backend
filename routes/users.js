const express = require('express');
const _ = require('lodash');
const HttpStatus = require('http-status-codes');
const usersRouter = express.Router();

// logger
const logger = require('../config/winston');

/* GET user profile. */
usersRouter.get('/user', function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  logger.info(`Sent user profile to client. user: ${userProfile.id}`)
  res.status(HttpStatus.OK).json({
    message: 'user profile',
    user: userProfile
  })
});

module.exports = usersRouter;
