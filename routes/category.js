const express = require('express');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const Category = require('../models/category');
const Memory = require('../models/memory');
const HttpStatus = require('http-status-codes');
const logger = require('../config/winston');

const categoryRouter = express.Router();

/**
 * API (GET) : getAllCategories
 */
categoryRouter.get('/categories', function(req, res) {
    var query = {
        attributes: [ 'id', 'nameFI', 'descriptionFI', 'nameSV', 'descriptionSV', 'nameEN', 'descriptionEN', 'passivated',
            [Sequelize.fn('COUNT',Sequelize.col(`Memories.id`)),'memoryCount']],
        include:[
            {
                model: Memory,
                required: false,
                attributes: []
            }
        ],
        group: ['id', 'nameFI', 'descriptionFI', 'nameSV', 'descriptionSV', 'nameEN', 'descriptionEN', 'passivated'],
        order: [['nameFI', 'ASC']],
        raw: true,
        logging: console.log
    };
    // This logger does not work for the moment correctly
    // logger.debug(`fetchAllCategories: query= ${query.toString()}`);
    Category.findAll(query)
        .then(categories => {
            logger.info(`List of categories sent - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            // TODO Test, remove when everything works ok ----------
            var categoryTmp = categories[0];
            logger.debug( `category[0]: id=${categoryTmp.id}, nameFI=${categoryTmp.nameFI}, memoryCount=${categoryTmp.memoryCount}`);
            // Test end ---------
            res.status(HttpStatus.OK).json({
                message: 'Found these categories',
                categories: categories,
            });
        })
        .catch(err => {
            logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Bad request',
            });
        });
});

/**
 * API (GET) : getActiveCategories
 */
categoryRouter.get('/categoriesactive', function(req, res) {
    var query = {
        attributes: [ 'id', 'nameFI', 'descriptionFI', 'nameSV', 'descriptionSV', 'nameEN', 'descriptionEN', 'passivated',
            [Sequelize.fn('COUNT',Sequelize.col(`Memories.id`)),'memoryCount']],
        include:[
            {
                model: Memory,
                required: false,
                attributes: []
            }
        ],
        where: {
            passivated: {
                [Op.or]: {
                    [Op.is]: null,
                    [Op.eq]: 0,
                }
            }
        },
        group: ['id', 'nameFI', 'descriptionFI', 'nameSV', 'descriptionSV', 'nameEN', 'descriptionEN', 'passivated'],
        order: [['nameFI', 'ASC']],
        raw: true,
        logging: console.log
    };
    // This logger does not work for the moment correctly
    // logger.debug(`fetchAllCategories: query= ${query.toString()}`);
    Category.findAll(query)
        .then(categories => {
            logger.info(`List of categories sent - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            // TODO Test, remove when everything works ok ----------
            //var categoryTmp = categories[0];
            //logger.debug( `category[0]: id=${categoryTmp.id}, nameFI=${categoryTmp.nameFI}, memoryCount=${categoryTmp.memoryCount}`);
            // Test end ---------
            res.status(HttpStatus.OK).json({
                message: 'Found these categories',
                categories: categories,
            });
        })
        .catch(err => {
            logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
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
            logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            res.send(err);
        });
});

module.exports = categoryRouter;
