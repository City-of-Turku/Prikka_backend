const express = require('express');
const Sequelize = require('sequelize');
const User = require('../models/user');
const Memory = require('../models/memory');
const Report = require('../models/report');
const Category = require('../models/category');
const HttpStatus = require('http-status-codes');
const passport = require('passport');
var _ = require('lodash');

// logger
const logger = require('../config/winston');

const adminRouter = express.Router();

/*
    MEMORIES - UPDATE/DELETE MEMORIES
*/

adminRouter.put('/memory-management/memories/:id', function(req, res) {
	let memoryId = req.params.id;
	Memory.findByPk(req.params.id)
		.then((memory) => {
			let memoryBody = req.body;
			memory.update(memoryBody);
			logger.info(`User ${req.user.id}, updated memory ${memoryId}`);
			res.status(HttpStatus.OK).json({
				message: 'Memory updated',
				memory: memory
			});
		})
		.catch(function(err) {
			res.status(HttpStatus.NOT_FOUND).send(`Memory not found.`);
		});
});

adminRouter.delete('/memory-management/memories/:id', function(req, res) {
	let memoryId = req.params.id;
	Memory.destroy({
		where: {
			id: memoryId
		}
	})
		.then((result) => {
			// result changes between 0 and 1 if memory is found
			if (result) {
				logger.info(`User: ${req.user.id}, deleted memory: ${memoryId}`);
				// deleted memory
				res.status(HttpStatus.OK).json({
					message: `Deleted memory ${memoryId}`
				});
			} else {
				// memory not found
				res.status(HttpStatus.NOT_FOUND).send(`Memory ${memoryId} not found`);
			}
		})
		.catch((err) => {
			logger.error(err);
		});
});

/*
    USERS - UPDATE/DELETE USERS
*/

adminRouter.put('/auth-management/user/:id', function(req, res) {
	let updatedUser = _.pick(req.body, [ 'displayName', 'email', 'admin' ]);
	let userId = req.params.id;
	if (_.isEmpty(updatedUser || req.user.id === userId)) {
		res.status(HttpStatus.BAD_REQUEST).json({
			message: 'Bad request'
		});
	} else {
		User.update(updatedUser, {
			where: {
				id: userId
			},
			fields: [ 'displayName', 'email', 'admin' ]
		})
			.then((result) => {
				if (result[0]) {
					// = if true, nothing was changed
					logger.info(
						`User ${req.user.id} updated user ${userId}. New updated user: ${JSON.stringify(updatedUser)}`
					);
					res.status(HttpStatus.OK).json({
						message: 'User updated',
						user: updatedUser
					});
				} else {
					logger.info(`User ${req.user.id} attempted updating user ${userId} and failed`);
					res.status(HttpStatus.BAD_REQUEST).json({
						message: 'Nothing was changed'
					});
				}
			})
			.catch(Sequelize.UniqueConstraintError, (err) => {
				res.status(HttpStatus.BAD_REQUEST).json({
					message: err.errors[0].message
				});
			})
			.catch((err) => {
				logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
				res.status(HttpStatus.OK).json({
					message: 'Something went wrong'
				});
			});
	}
});

adminRouter.delete('/auth-management/user/:id', function(req, res) {
	let userId = req.params.id;
	if (parseInt(userId) === req.user.id) {
		logger.info(`${userId} tried deleting themselves`);
		res.status(HttpStatus.BAD_REQUEST).json({
			message: 'Cant delete yourself'
		});
	} else {
		User.destroy({
			where: {
				id: userId
			}
		})
			.then((result) => {
				if (result) {
					logger.info(`user ${req.user.id} deleted user ${userId}`);
					res.status(HttpStatus.OK).json({
						message: `Deleted user ${userId}`
					});
				} else {
					res.status(HttpStatus.NOT_FOUND).json({
						message: `No such user`
					});
				}
			})
			.catch((err) => {
				logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
				res.status(HttpStatus.BAD_REQUEST).json({
					message: 'Bad request'
				});
			});
	}
});

/* 
    REPORTS - DELETE MEMORY REPORTS
*/

adminRouter.delete('/auth-management/reports/:id', function(req, res) {
	let reportId = req.params.id;
	Report.destroy({
		where: {
			id: reportId
		}
	})
		.then((result) => {
			if (result) {
				logger.info(`Deleted report ${reportId}`);
				res.status(HttpStatus.OK).send(`Deleted report ${reportId}`);
			} else {
				res.status(HttpStatus.NOT_FOUND).send(`No such report`);
			}
		})
		.catch((err) => {
			logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
			res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Bad request'
			});
		});
});

/**
 * API (GET) : getMemoryReportsById *** MOVED FROM memory.js ***
 */
adminRouter.get('/memory-management/reports/:id', function(req, res) {
    Report.findAndCountAll({
        where: {
            MemoryId: req.params.id,
        },
    })
        .then(reports => {
            if (reports.count != 0) {
                logger.info(`sending list of reports on memory ${req.params.id} to client`)
                res.status(HttpStatus.OK).send(reports);
            } else {
                throw 'No reports on memory.';
            }
        })
        .catch(function(err) {
            logger.error(err)
            res.send(err);
        });
});

/* 
    CATEGORIES - CREATE/UPDATE/DELETE MEMORY CATEGORIES
*/
adminRouter.post('/category-management/categories', function(req, res) {
	if (_.isEmpty(req.body)) {
		logger.info(`User ${req.user.id} tried creating an empty category`);
		res.status(HttpStatus.BAD_REQUEST).json({
			message: 'Bad request'
		});
	}
	let categoryBody = req.body;
	Category.create(categoryBody)
		.then((newCategory) => {
			logger.info(`User ${req.user.id} created new category ${JSON.stringify(newCategory)}`);
			res.status(HttpStatus.CREATED).json({
				message: 'Category created',
				category: newCategory
			});
		})
		.catch(Sequelize.UniqueConstraintError, (err) => {
			logger.info(
				`User ${req.user.id} tried creating new category but failed: ${err}`
			);
			res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Category with that name already exists. Category name must be unique'
			});
		})
		.catch((err) => {
			logger.error(err);
			console.log('aasadasdasdd',err)
			res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Bad request'
			});
		});
});

adminRouter.put('/category-management/categories/:id', function(req, res) {
	let categoryId = req.params.id;
	let updatedCategory = _.pick(req.body, [ 'name', 'description' ]);
	if (_.isEmpty(updatedCategory)) {
		res.status(HttpStatus.BAD_REQUEST).json({
			message: 'Bad request' // empty body, boo!
		});
	}
	Category.update(updatedCategory, {
		where: {
			id: categoryId
		},
		fields: [ 'name', 'description' ]
	})
		.then((result) => {
			if (result[0]) {
				logger.info(`User ${req.user.id} updated category ${categoryId}, updated category: ${updatedCategory}`);
				res.status(HttpStatus.OK).json({
					message: 'Category updated',
					category: updatedCategory
				});
			} else {
				res.status(HttpStatus.NOT_FOUND).json({
					message: 'No changes were made'
				});
			}
		})
		.catch(Sequelize.UniqueConstraintError, (err) => {
			logger.info(`User ${req.user.id} tried updating category ${categoryId} but failed: ${err}`);
			res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Category with that name already exists. Category name must be unique'
			});
		})
		.catch((err) => {
			logger.error(err);
			res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Bad request'
			});
		});
});

adminRouter.delete('/categories-management/categories/:id', function(req, res) {
	let categoryId = req.params.id;
	Category.destroy({
		where: {
			id: categoryId
		}
	})
		.then((result) => {
			if (result) {
				logger.info(`User ${req.user.id} deleted category ${categoryId}`);
				res.status(HttpStatus.OK).send(`Deleted category ${categoryId}`);
			} else {
				res.status(HttpStatus.NOT_FOUND).send(`No such category`);
			}
		})
		.catch((err) => {
			logger.error(err);
			res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Bad request'
			});
		});
});

module.exports = adminRouter;
