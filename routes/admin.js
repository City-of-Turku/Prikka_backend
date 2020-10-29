const express = require('express');
const Sequelize = require('sequelize');
const User = require('../models/user');
const Memory = require('../models/memory');
const Report = require('../models/report');
const Category = require('../models/category');
const Campaign = require('../models/campaign');
const HttpStatus = require('http-status-codes');
const passport = require('passport');
var _ = require('lodash');

// logger
const logger = require('../config/winston');

const adminRouter = express.Router();

/*
    MEMORIES - UPDATE MEMORIES - Admin cannot update the memory. Admin can only move the memory to archive.
*/

adminRouter.put('/memory-management/memories/:id', function(req, res) {
	let memoryId = req.params.id;
	let updatedMemory = _.pick(req.body, [ 'archiveReason' ]);
	updatedMemory['archiveAdminUserId'] = req.user.id;
	updatedMemory['archiveDate'] = Date.now();

	if (_.isEmpty(updatedMemory)) {
		res.status(HttpStatus.BAD_REQUEST).json({
			message: 'Bad request' // empty body!
		});
	}

	Memory.update(updatedMemory,{
		where: {
			id: memoryId
		},
		fields: [ 'archiveReason', 'archiveAdminUserId', 'archiveDate']
	})
		.then((result) => {
			if (result[0]) {
				logger.info(`User ${req.user.id} archived memory with id ${memoryId}`);
				res.status(HttpStatus.OK).json({
					message: `Memory updated`,
					memory: result
				});
			} else {
				res.status(HttpStatus.NOT_FOUND).send(`No such memory`);
			}
		})
		.catch(function(err) {
			logger.error(err);
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
    USERS - GET USERS
*/

adminRouter.get('/auth-management/user', function(req, res) {
	let filters = {
		order: [['id', 'ASC']],
	};

	logger.info(filters);
	User.findAndCountAll(filters)
		.then(users => {
			logger.info(`sending users to client - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			if (users.count != 0) {
				res.status(HttpStatus.OK).send(users);
			} else {
				throw 'No users to send';
			}
		})
		.catch(function(err) {
			logger.error(err);
			res.status(HttpStatus.NOT_FOUND).send(`Users not found.`);
		});

	}
);


/*
    USERS - UPDATE USER
*/

adminRouter.put('/auth-management/user/:id', function(req, res) {
	let updatedUser = _.pick(req.body, [ 'userName', 'displayName', 'email', 'admin' ]);
	let userId = req.params.id;
	logger.info(`User ${req.user.id} tries to update user ${userId}; username: ${updatedUser.userName}, displayname: ${updatedUser.displayName}, e-mail: ${updatedUser.email}, admin: ${updatedUser.admin}`);

	if (_.isEmpty(updatedUser || req.user.id === userId)) {
		res.status(HttpStatus.BAD_REQUEST).json({
			message: 'Bad request'
		});
	} else {
		User.update(updatedUser, {
			where: {
				id: userId
			},
			fields: [ 'userName', 'displayName', 'email', 'admin' ]
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


/*
    USERS - DELETE USER
*/

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


/**
 * API (GET) : getMemoryReportsById *** MOVED FROM memory.js ***
 */
adminRouter.get('/memory-management/reports/:id', function(req, res) {
	Logger.arguments(req);
	Report.findAndCountAll({
		where: {
			MemoryId: req.params.id,
		},
	})
		.then(reports => {
			if (reports.count != 0) {
				logger.info(`sending list of reports on memory ${req.params.id} to client`);
				res.status(HttpStatus.OK).send(reports);
			} else {
				throw 'No reports on memory.';
			}
		})
		.catch(function(err) {
			logger.error(err);
			res.send(err);
		});
});


/********************************************************************************
 *    REPORTS - UPDATE/DELETE MEMORY REPORTS                                    *
 ********************************************************************************/

adminRouter.put('/auth-management/reports/:id', function(req, res) {
	let reportId = req.params.id;
	let updatedReport = _.pick(req.body, [ 'invalid' ]);
	updatedReport['adminUserId'] = req.user.id;
	if (_.isEmpty(updatedReport)) {
		res.status(HttpStatus.BAD_REQUEST).json({
			message: 'Bad request' // empty body, boo!
		});
	}
	logger.info(`User ${req.user.id} tries to update report ${reportId}, invalid: ${updatedReport.invalid}`);

	// Update report from valid('0') to invalid('1') or invalid('1') to valid ('0')
	Report.update(updatedReport,{
		where: {
			id: reportId
		},
		fields: [ 'invalid', 'adminUserId']
	})
	.then((result) => {
		if (result[0]) {
			logger.info(`User ${req.user.id} updated report with id ${reportId}, invalid: ${updatedReport.invalid}`);

			// The report was updated, now we still need to update activeReports for memory
			// Start by fetching the report in order to get the memoryId
			Report.findByPk(reportId, {
				attributes: ['memoryId']},
			)
			.then(report => {
				if (report!=null) {

					// Then fetch the memory in order to get the activeReports content
					Memory.findByPk(report.memoryId)
					.then(memory => {
						if (memory!=null){
							let activeRep = memory.activeReports+1;
							if (updatedReport.invalid){
								activeRep = memory.activeReports-1;
							}

							// Finally update the activeReports column
							Memory.update(
								{
									'activeReports': activeRep},
								{
								where: {
									id: memory.id
								}})
								.then(memoryUpdate => {
									if (memoryUpdate) {
										// Update of activeReport for memory was successful
									} else {
										// Update of activeReport for memory was unsuccessful
										// TODO What to do?
									}
								})
								.catch((err) => {
									logger.error(err);
									res.status(HttpStatus.BAD_REQUEST).json({
										message: 'Memory activeReport update was unsuccessful'
									});
								});
							res.status(HttpStatus.OK).json({
								message: 'Report updated',
								category: updatedReport
							});

						}
					});
				}
			})

		} else {
			res.status(HttpStatus.NOT_FOUND).send(`No such report`);
		}
	})
	.catch((err) => {
		logger.error(err);
		res.status(HttpStatus.BAD_REQUEST).json({
			message: 'Bad request'
		});
	});
});

// TODO Not in use?
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
			logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Bad request'
			});
		});
});


/*******************************************************************************
*    CATEGORIES - CREATE/UPDATE/DELETE MEMORY CATEGORIES                       *
********************************************************************************/

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
			console.log('aasadasdasdd',err);
			res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Bad request'
			});
		});
});

adminRouter.put('/category-management/categories/:id', function(req, res) {
	let categoryId = req.params.id;
	// let updatedCategory = _.pick(req.body, [ 'name', 'description' ]);
	let updatedCategory = _.pick(req.body, [ 'nameFI', 'descriptionFI', 'nameSV', 'nameEN', 'passivated' ]);
	if (_.isEmpty(updatedCategory)) {
		res.status(HttpStatus.BAD_REQUEST).json({
			message: 'Bad request' // empty body, boo!
		});
	}
	logger.info(`User ${req.user.id} tries to update category ${categoryId}, updated category name: ${updatedCategory.nameFI} and category description: ${updatedCategory.descriptionFI}`);
	Category.update(updatedCategory, {
		where: {
			id: categoryId
		},
		fields: [ 'nameFI', 'descriptionFI', 'nameSV', 'nameEN', 'passivated' ]
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

adminRouter.delete('/category-management/categories/:id', function(req, res) {
	let categoryId = req.params.id;
	logger.info(`User ${req.user.id} try to delete category ${categoryId}`);
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



/********************************************************************************
 *    CAMPAIGNS - CREATE/UPDATE/DELETE MEMORY CAMPAIGNS                         *
 ********************************************************************************/

adminRouter.get('/campaign-management/campaigns', function(req, res) {
	Campaign.findAndCountAll({
		// include: [ {
		// 	model: User,
		// 	attributes: ['displayName']
		// }],
		attributes: ['id', 'titleEN', 'titleFI', 'titleSV', 'descriptionEN', 'descriptionFI', 'descriptionSV',
			'createdAt', 'categoryId', 'isPublic', 'visibleUntilDate'],
		order: [['createdAt', 'DESC']],
	})
		.then(campaigns => {
			logger.info(`List of campaigns sent - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.status(HttpStatus.OK).send(campaigns);
		})
		.catch(err => {
			logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Bad request',
			});
		});
});

adminRouter.post('/campaign-management/campaigns', function(req, res) {
	if (_.isEmpty(req.body)) {
		logger.info(`User ${req.user.id} tried creating an empty campaign`);
		res.status(HttpStatus.BAD_REQUEST).json({
			message: 'Bad request'
		});
	}
	let campaignBody = req.body;
	campaignBody['userId'] = req.user.id;
	Campaign.create(campaignBody)
		.then((newCampaign) => {
			logger.info(`User ${req.user.id} created new campaign ${JSON.stringify(newCampaign)}`);
			res.status(HttpStatus.CREATED).json({
				message: 'Campaign created',
				campaign: newCampaign
			});
		})
		.catch((err) => {
			logger.error(err);
			console.log('Campaign creation was unsuccessfull',err);
			res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Bad request'
			});
		});
});

adminRouter.put('/campaign-management/campaigns/:id', function(req, res) {
	let campaignId = req.params.id;
	let updatedCampaign = _.pick(req.body,
		[ 'titleFI', 'descriptionFI', 'titleSV', 'descriptionSV', 'titleEN', 'descriptionEN', 'categoryId',
			'isPublic', 'visibleUntilDate' ]);
	if (_.isEmpty(updatedCampaign)) {
		res.status(HttpStatus.BAD_REQUEST).json({
			message: 'Bad request' // empty body!
		});
	}
	logger.info(`User ${req.user.id} tries to update campaign ${campaignId}`);
	Campaign.update(updatedCampaign, {
		where: {
			id: campaignId
		},
		fields: [ 'titleFI', 'descriptionFI', 'titleSV', 'descriptionSV', 'titleEN', 'descriptionEN', 'categoryId',
			'isPublic', 'visibleUntilDate' ]
	})
		.then((result) => {
			if (result[0]) {
				logger.info(`User ${req.user.id} updated campaign ${campaignId}`);
				res.status(HttpStatus.OK).json({
					message: 'Campaign updated',
					campaign: updatedCampaign
				});
			} else {
				res.status(HttpStatus.NOT_FOUND).json({
					message: 'No changes were made'
				});
			}
		})
		.catch((err) => {
			logger.error(err);
			res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Bad request'
			});
		});
});

adminRouter.delete('/campaign-management/campaigns/:id', function(req, res) {
	let campaignId = req.params.id;
	logger.info(`User ${req.user.id} try to delete campaign ${campaignId}`);
	Campaign.destroy({
		where: {
			id: campaignId
		}
	})
		.then((result) => {
			if (result) {
				logger.info(`User ${req.user.id} deleted campaign ${campaignId}`);
				res.status(HttpStatus.OK).send(`Deleted campaign ${campaignId}`);
			} else {
				res.status(HttpStatus.NOT_FOUND).send(`No such campaign`);
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
