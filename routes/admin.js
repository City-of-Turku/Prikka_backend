const express = require('express');
const Sequelize = require('sequelize');
const User = require('../models/user');
const Memory = require('../models/memory');
const Report = require('../models/report');
const Category = require('../models/category');
const HttpStatus = require('http-status-codes');
const passport = require('passport');
var _ = require('lodash');

const adminRouter = express.Router();

/*
    MEMORIES - UPDATE/DELETE MEMORIES
*/

adminRouter.put('/memory-management/memories/:id', function(req, res) {
	Memory.findByPk(req.params.id)
		.then((memory) => {
			let memoryBody = req.body;
			memory.update(memoryBody);
			res.send(memory);
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
				// deleted memory
				res.status(HttpStatus.OK).send(`Deleted memory #${memoryId}`);
			} else {
				// memory not found
				res.status(HttpStatus.NOT_FOUND).send(`Memory ${memoryId} not found`);
			}
		})
		.catch((err) => {
			console.error(err);
		});
});

/*
    USERS - UPDATE/DELETE USERS
*/

adminRouter.put('/auth-management/user/:id', function(req, res) {
	let updatedUser = _.pick(req.body, ['username', 'email', 'admin']);
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
			fields: ['username', 'email', 'admin'],
        })
			.then(result => {
				if (result[0]) { // = if true, nothing was changed
					res.status(HttpStatus.OK).json({
						message: 'User updated',
						user: updatedUser
					});
				} else {
					res.status(HttpStatus.BAD_REQUEST).json({
						message: 'Nothing was changed'
					})
				}
			})
			.catch(Sequelize.UniqueConstraintError, (err) => {
				res.status(HttpStatus.BAD_REQUEST).json({
					message: err.errors[0].message
				});
            })
            .catch(err => {
                console.error(err)
                res.status(HttpStatus.OK).json({
					message: 'Something went wrong'
				});
            })
	}
});

adminRouter.delete('/auth-management/user/:id', function(req, res) {
	let userId = req.params.id;
	if (parseInt(userId) === req.user.id) {
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
					res.status(HttpStatus.OK).send(`Deleted user ${userId}`);
				} else {
					res.status(HttpStatus.NOT_FOUND).send(`No such user`);
				}
			})
			.catch((err) => {
				console.error(err);
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
				res.status(HttpStatus.OK).send(`Deleted report ${reportId}`);
			} else {
				res.status(HttpStatus.NOT_FOUND).send(`No such report`);
			}
		})
		
		.catch((err) => {
			console.error(err);
			res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Bad request'
			})
		});
});

/* 
    CATEGORIES - CREATE/UPDATE/DELETE MEMORY CATEGORIES
*/
adminRouter.post('/memory-management/categories', function(req, res) {
	if (_.isEmpty(req.body)) {
		console.log('empty body')
		res.status(HttpStatus.BAD_REQUEST).json({
			message: 'Bad request'
		})
	}
	let categoryBody = req.body;
	Category.create(categoryBody)
		.then(newCategory => {
			res.status(HttpStatus.CREATED).json({
				message: 'Category created',
				category: newCategory
			});
		})
		.catch(Sequelize.UniqueConstraintError, (err) => {
			res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Category with that name already exists. Category name must be unique'
			});
		})
		.catch(err => {
			console.error(err);
			res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Bad request'
			})
		})
});

adminRouter.put('/memory-management/categories/:id', function(req, res) {
	let categoryId = req.params.id;
	let updatedCategory = _.pick(req.body, ['name', 'description'])
	if (_.isEmpty(updatedCategory)) {
		res.status(HttpStatus.BAD_REQUEST).json({
			message: 'Bad request' // empty body, boo!
		})
	}
	Category.update(updatedCategory, {
		where: {
			id: categoryId
		},
		fields: ['name', 'description']
	})
	.then((result) => {
		console.log(result)
		if(result[0]) {
			res.status(HttpStatus.OK).json({
				message: 'Category updated',
				category: updatedCategory
			})
		} else {
			res.status(HttpStatus.NOT_FOUND).json({
				message: 'No changes were made'
			})
		}
	})
	.catch(Sequelize.UniqueConstraintError, (err) => {
		res.status(HttpStatus.BAD_REQUEST).json({
			message: 'Category with that name already exists. Category name must be unique'
		});
	})
	.catch(err => {
		console.error(err)
		res.status(HttpStatus.BAD_REQUEST).json({
			message: 'Bad request'
		})
	})

});

adminRouter.delete('/memory-management/categories/:id', function(req, res) {
	let categoryId = req.params.id;
	Category.destroy({
		where: {
			id: categoryId
		}
	})
		.then((result) => {
			if (result) {
				res.status(HttpStatus.OK).send(`Deleted category ${categoryId}`);
			} else {
				res.status(HttpStatus.NOT_FOUND).send(`No such category`);
			}
		})
		
		.catch((err) => {
			console.error(err);
			res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Bad request'
			})
		});
});

module.exports = adminRouter;
