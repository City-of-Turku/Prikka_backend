const express = require('express');
const Category = require('../models/category');
const HttpStatus = require('http-status-codes');

// logger
const logger = require('../config/winston');

const categoryRouter = express.Router();

/**
 * API (POST) : createCategory
 */
categoryRouter.post('/categories', function(req, res) {
    let categoryBody = req.body;
    Category.create(categoryBody)
        .then(category => {
            res.status(HttpStatus.CREATED).send(category);
        })
        .catch(err => {
            logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
            res.status(HttpStatus.BAD_REQUEST).send(
                `Error while creating a category.`
            );
        });
});

/**
 * API (GET) : getAllCategories
 */
categoryRouter.get('/categories', function(req, res) {
    Category.findAll({
        attributes: ['name', 'description', 'id'],
    })
        .then(categories => {
            logger.info(`List of categories sent - ${req.originalUrl} - ${req.method} - ${req.ip}`)
            res.status(HttpStatus.OK).json({
                message: 'Found these categories',
                categories: categories,
            });
        })
        .catch(err => {
            logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Bad request',
            });
        });
});

/**
 * API (GET) : getMemoriesByCategoryId
 */
categoryRouter.get('/categories/:id', function(req, res) {
    Memory.findAndCountAll({
        where: {
            categoryId: req.params.id,
        },
    })
        .then(memories => {
            if (memories.count != 0) {
                res.status(HttpStatus.OK).send(memories);
            } else {
                throw 'Category has no memories.';
            }
        })
        .catch(function(err) {
            logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
            res.send(err);
        });
});

module.exports = categoryRouter;
