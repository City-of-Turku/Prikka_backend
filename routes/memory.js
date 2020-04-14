const express = require('express');
const Memory = require('../models/memory');
const Report = require('../models/report');
const User = require('../models/user')
const Category = require('../models/category');
const HttpStatus = require('http-status-codes');
const memoryRouter = express.Router();
const { Op } = require('sequelize');
const passport = require('passport');
const sequelize = require('../config/db').sequelize;
const multer = require('multer');
const fs = require('fs');

// logger
const logger = require('../config/winston');

const secured = require('../middleware/secured')

const upload = multer({
    dest: './public/uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        }
        else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
    limits: { fileSize:  10 * 1024 * 1024 }
})

/**
 * API (GET) : getAllMemories
 *
 * Optional parameters:
 * - categoryId : to get only memories from one category
 * - page : offset, to get memories 10 by 10 from database (reduce server load)
 *
 */

memoryRouter.get('/memories', function(req, res) {
    let filters = {
        order: [['id', 'ASC']],
    };

    
    filters.include = [
        {
            model: User,
            attributes: ['displayName']
        }, 
        {
            model: Report,
            required: false,
            attributes: ['id']
        }
    ];
 
    filters.distinct = true


    //Obtain GET request parameters
    //filter by category
    let categoriesParam = req.query.categoryId;
    if (categoriesParam) {
        let categoryIdList = categoriesParam.split(',');
        filters.where = { categoryId: { [Op.or]: categoryIdList } };
    }

    //filter by category
    let page = req.query.page;
    if (page) {
        let maxPerRequest = 10;
        filters.offset = page * maxPerRequest;
        filters.limit = maxPerRequest;
    }

    logger.info(filters);
    Memory.findAndCountAll(filters)
        .then(memories => {
            logger.info(`sending memories to client - ${req.originalUrl} - ${req.method} - ${req.ip}`)
            if (memories.count != 0) {
                res.status(HttpStatus.OK).send(memories);
            } else {
                throw 'No memory to send';
            }
        })
        .catch(function(err) {
            logger.error(err);
            res.status(HttpStatus.NOT_FOUND).send(`Memories not found.`);
        });
});

/**
 * API (POST) : createMemory
 */
memoryRouter.post('/memories', upload.single("file"), function(req, res) { 
    let userId = null;

    if (req.user) {
        userId = req.user.id;
    }

    let memoryBody = req.body;
    const file = req.file;
    const position = JSON.parse(memoryBody['position']);
    console.log(req.body)
    
    memoryBody['position'] = position;
    memoryBody['userId'] = userId;
    memoryBody['photo'] = file;
    console.log(memoryBody)
    Memory.create(memoryBody)
        .then(memory => {
            console.log(memory)
            res.status(HttpStatus.CREATED).send(memory);
        })
        .catch(err => {
            logger.error(err);
            res.status(HttpStatus.BAD_REQUEST).send(
                `Error while creating a memory.`
            );
        });
});

/**
 * API (GET) : getMemoryById
 */
memoryRouter.get('/memories/:id', function(req, res) {
    Memory.findByPk(req.params.id,{ 
        include: 
        [
            {
                model: User,
                attributes: ['displayName']
            }, 
            {
                required: true,
                model: Report,
                attributes: []
            }
        ],
        attributes: { include: [
        [sequelize.fn('COUNT', 'Report.id'), 'reportsCount']
        ]},
        
    })
        .then(memory => {
            logger.info(`Sending memory to client, ${req.originalUrl} - ${req.method} - ${req.ip}`)
            res.status(HttpStatus.OK).send(memory);
        })
        .catch(function(err) {
            logger.error(err)
            res.status(HttpStatus.NOT_FOUND).send(err);
        });
});

/**
 * API (PUT) : updateMemoryById
 */
memoryRouter.put('/memories/:id', secured(), function(req, res) {
    let memoryId = req.params.id;
    let user = req.user;
    Memory.findOne({
        where: {
            id: memoryId,
            userId: user.id
        },
    })
        .then(memory => {
            logger.info(`Updated memory, used: ${user.id} ${req.originalUrl} - ${req.method} - ${req.ip}`)
            let memoryBody = req.body;
            memory.update(memoryBody);
            res.send(memory);
        })
        .catch(function(err) {
            logger.error(err)
            res.status(HttpStatus.NOT_FOUND).send(`Memory not found.`);
        });
});

/**
 * API (DELETE) : deleteMemoryById
 */
memoryRouter.delete('/memories/:id', secured(), function(req, res) {
    let memoryId = req.params.id;
    let user = req.user;
    Memory.destroy({
        where: {
            id: memoryId,
            userId: user.id,
        },
    })
        .then(result => {
            // result changes between 0 and 1 if memory is found
            if (result) {
                logger.info(`User ${userId} deleted memory ${memoryId}`)
                // deleted memory
                res.status(HttpStatus.OK).send(`Deleted memory #${memoryId}`);
            } else {
                // memory not found or client is trying to delete someone else's memory
                // TODO: admin user should never get this
                res.status(HttpStatus.FORBIDDEN).send(`Forbidden`);
            }
        })
        .catch(err => {
            logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
        });
    }
);

/**
 * API (POST) : createMemoryReport
 */
memoryRouter.post('/reports', secured(), function(req, res) {
    let user = req.user;
    let reportBody = req.body;
    reportBody.userId = user.id;
    Memory.findOne({
        where: {
            id: reportBody.memoryId
        },
    })
        .then(memory => {
            logger.info('MEMORY FOUND');
            Report.findOne({
                where: {
                    memoryId: reportBody.memoryId,
                    userId: reportBody.userId,
                },
            })
                .then(report => {
                    if (report == null) {
                        // If existing report on memory is not found, new report is created.
                        Report.create(reportBody)
                            .then(report => {
                                logger.info(`user ${user.id} reported memory ${reportBody.memoryId}`)
                                res.status(HttpStatus.CREATED).send(report);
                            })
                            .catch(function(err) {
                                logger.error(err);
                                res.status(HttpStatus.BAD_REQUEST).json({
                                    message: 'Error creating report'
                                });
                                throw 'Error creating report.';
                            });
                    } else {
                        // If existing report on memory is found.
                        res;
                        throw 'Memory already reported by user.';
                    }
                })
                .catch(function(err) {
                    logger.error(err);
                    res.status(HttpStatus.BAD_REQUEST).send(err);
                });
        })
        .catch(function(err) {
            logger.error(`Memory not found: ${err}`)
            res.status(HttpStatus.BAD_REQUEST).send(err);
        })
});


/**
 * API (POST) : createCategory
 */
// memoryRouter.post('/categories', function(req, res) {
//     let categoryBody = req.body;
//     Category.create(categoryBody)
//         .then(category => {
//             res.status(HttpStatus.CREATED).send(category);
//         })
//         .catch(err => {
//             logger.error(err);
//             res.status(HttpStatus.BAD_REQUEST).send(
//                 `Error while creating a category.`
//             );
//         });
// });



/**
 * API (GET) : getUserMemories
 */
memoryRouter.get('/mymemories', function(req, res) {
    let user = req.user;
    if (req.user) {
        Memory.findAndCountAll({
            where: {
                userId: user.id,
            },
        })
            .then(memories => {
                res.status(HttpStatus.OK).send(memories);
            })
            .catch(err => {
                res.status(HttpStatus.NOT_FOUND).send(err);
            });
    } else {
        res.status(HttpStatus.FORBIDDEN).send(err);
    }
});

module.exports = memoryRouter;
