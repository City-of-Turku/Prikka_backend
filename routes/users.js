const express = require('express');
const _ = require('lodash');
const HttpStatus = require('http-status-codes');
const usersRouter = express.Router();
const User = require('../models/user');


// logger
const logger = require('../config/winston');

/* GET user profile. */
usersRouter.get('/user', function (req, res, next) {
    const userId = req.user.id;
    logger.info(`TEST1 Sending user for ${userId}`)
    User.findByPk(userId, {
        where: {
            id: userId,
        },
    })
        .then(user => {
            logger.info(`TEST1 reqParam= ${userId} userCount= ${user.count}`);
            if (user.count != 0) {
                res.status(HttpStatus.OK).json({
                    message: 'user profile',
                    user: user
                })
            } else {
                throw 'User not found.';
            }
        })
        .catch(function (err) {
            logger.error(err)
            res.send(err);
        });

});

usersRouter.get('/user/:id', function (req, res) {
    logger.info(`Sending user for ${req.params.id}`)
    User.findByPk(req.params.id, {
        where: {
            id: req.params.id,
        },
    })
        .then(user => {
            logger.info(`TEST2 reqParam= ${req.params.id} userCount= ${user.count}`);
            if (user.count != 0) {
                res.status(HttpStatus.OK).send(user);
            } else {
                throw 'User not found.';
            }
        })
        .catch(function (err) {
            logger.error(err)
            res.send(err);
        });
});

/* Update user, the user id is taken from the request */
usersRouter.put('/user', function(req, res) {
    let userId = req.user.id;
    let updatedUser = _.pick(req.body, [ 'userName', 'displayName', 'yearOfBirth', 'email' ]);

    if (_.isEmpty(updatedUser)) {
        res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Bad request' // empty body!
        });
    }

    User.update(updatedUser,{
        where: {
            id: userId
        },
        fields: [ 'userName', 'displayName', 'yearOfBirth', 'email' ]
    })
        .then((result) => {
            if (result[0]) {
                logger.info(`User ${req.user.id} updated`);
                res.status(HttpStatus.OK).json({
                    message: `User updated`,
                    memory: result
                });
            } else {
                res.status(HttpStatus.NOT_FOUND).send(`No such user`);
            }
        })
        .catch(function(err) {
            logger.error(err);
            res.status(HttpStatus.NOT_FOUND).send(`User not found.`);
        });
});

module.exports = usersRouter;
