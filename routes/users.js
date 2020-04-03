const express = require('express');
const _ = require('lodash');
const HttpStatus = require('http-status-codes');
const usersRouter = express.Router();

/* GET user profile. */
usersRouter.get('/user', function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  res.status(HttpStatus.OK).json({
    message: 'moi',
    user: userProfile
  })
});

module.exports = usersRouter;
