const express = require('express');
const Memory = require('../models/memory');
const Report = require('../models/report');
const User = require('../models/user');
const Category = require('../models/category');
const HttpStatus = require('http-status-codes');
const memoryRouter = express.Router();
const { Op } = require('sequelize');
const passport = require('passport');
const sequelize = require('../config/db').sequelize;
const multer = require('multer');
const fs = require('fs');
var _ = require('lodash');

// logger
const logger = require('../config/winston');

const secured = require('../middleware/secured');

const upload = multer({
//    dest: process.env.IMAGE_UPLOAD_PATH,
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
});

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
        include: [
            {
                model: User,
                attributes: ['displayName']
            },
            // TODO Is Report needed?
            {
                model: Report,
                required: false,
                attributes: ['id']
            }
        ],
        where: {
            activeReports: {
                [Op.or]: {
                    [Op.is]: null,
                    [Op.lt]: 2
                }}},
        order: [['id', 'DESC']],
    };

    // filters.distinct = true;

    // filter by category
    let categoryId = req.query.categoryId;
    if (categoryId) {
        filters.where = {
                categoryId: req.query.categoryId,
                activeReports: {
                    [Op.or]: {
                        [Op.is]: null,
                        [Op.lt]: 2
                    }},
        };
    }

    // filter by page
    let page = req.query.page;
    if (page) {
        // Page=1 fetches memories 11-20.
        page = page-1;
        let maxPerRequest = 10;
        filters.offset = page * maxPerRequest;
        filters.limit = maxPerRequest;
    }
    logger.info("page="+page);
    logger.info("categoryId="+categoryId);

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

    // Debug -------------------------
    console.log(req.body);
    console.log(req.file);
    console.log(req.body.ispostman);

    let memoryBody = req.body;
    const file = req.file;

    // Postman debugging -------------------------
    let isPostman = req.body.ispostman;
    if (isPostman == "true") {
        console.log("*** Postman call, special variable names ***********");
        let postmanBody = memoryBody.body;
        let jsonBody =  JSON.parse(postmanBody);
        memoryBody['title'] = jsonBody.title;
        memoryBody['description'] = jsonBody.description;
        memoryBody['position'] = jsonBody.position;
        memoryBody['userId'] = userId;
        memoryBody['photo'] = file;
    }

    // isPostman variable is undefined normally
    if (isPostman != "true") {
        const position = JSON.parse(memoryBody['position']);
        console.log(req.body);
        memoryBody['position'] = position;
        memoryBody['userId'] = userId;
        memoryBody['photo'] = file;
    }

    console.log(memoryBody);
    Memory.create(memoryBody)
        .then(memory => {
            console.log(memory);
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
            logger.error(err);
            res.status(HttpStatus.NOT_FOUND).send(err);
        });
});

/**
 * API (PUT) : updateMemoryById
 */
memoryRouter.put('/memories/:id', upload.single("file"), secured(), function(req, res) {
    let memoryId = req.params.id;
    let updatedMemory = _.pick(req.body, [ 'title', 'categoryId', 'description', 'position', 'photographer', 'whenIsPhotoTaken', 'whereIsPhotoTaken' ]);
    let userId = req.user.id;
    const file = req.file;
    const position = JSON.parse(updatedMemory['position']);
    updatedMemory['position'] = position;
    updatedMemory['userId'] = userId;
    updatedMemory['photo'] = file;
    if (_.isEmpty(updatedMemory)) {
        res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Bad request' // empty body!
        });
    }
    Memory.update(updatedMemory, {
        where: {
            id: memoryId,
            userId: userId
        },
        fields: [ 'title', 'categoryId', 'description', 'position', 'photo', 'photographer', 'whenIsPhotoTaken', 'whereIsPhotoTaken' ]
    })
        .then((result) => {
            if (result[0]) {
                logger.info(`User ${req.user.id} updated memory ${memoryId}`);
                res.status(HttpStatus.OK).json({
                    message: 'Memory updated',
                    memory: updatedMemory
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
                logger.info(`User ${userId} deleted memory ${memoryId}`);
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
    reportBody.invalid = false;

    // Check if memory exits
    Memory.findOne({
        attributes: ['id', 'activeReports'],
        where: {
            id: reportBody.memoryId
        },
    })
    .then(memory => {
        // Memory found, check if same user already has reported this memory
        // We also need to check if the previous report was invalidated by admin
        Report.findOne({
            where: {
                memoryId: reportBody.memoryId,
                userId: reportBody.userId,
                invalid: false
            },
        })
        .then(report => {
            if (report == null) {
                // There does not exits an active report for this memory by the user.
                Report.create(reportBody)
                    .then(report => {
                        // Created a new report, we still need to update activeReports for memory
                        logger.info(`User ${user.id} reported memory ${reportBody.memoryId}`);
                        let activeRep = memory.activeReports+1;
                        Memory.update(
                            {
                                'activeReports': activeRep},
                            {
                            where: {
                                id: memory.id
                            }})
                            .then(memoryUpdate => {
                                if (memoryUpdate[0]){
                                    // Update of activeReport for memory was successful
                                } else {
                                    // Update of activeReport for memory was unsuccessful
                                    // TODO What to do?
                                }
                                res.status(HttpStatus.CREATED).send(report);
                            })
                            .catch(function(err) {
                                logger.error(err);
                                res.status(HttpStatus.BAD_REQUEST).send(err);
                            });
                    })
                    .catch(function(err) {
                        logger.error(err);
                        res.status(HttpStatus.BAD_REQUEST).json({
                            message: 'Error creating report'
                        });
                        throw 'Error creating report.';
                    });
            } else {
                // There already exists an active report for this memory by the user.
                res.status(HttpStatus.OK).send('Memory already reported by user.');
            }
        })
        .catch(function(err) {
            logger.error(err);
            res.status(HttpStatus.BAD_REQUEST).send(err);
        });
    })
    .catch(function(err) {
        logger.error(`Memory not found: ${err}`);
        res.status(HttpStatus.BAD_REQUEST).send(err);
    })
});


/**
 * API (GET) : getUserMemories
 */
memoryRouter.get('/mymemories', function(req, res) {
    let user = req.user;
    let filters = {
        order: [['id', 'DESC']],
    };

    filters.include = [
        {
            model: User,
            attributes: ['displayName']
        }
    ];

    filters.where = [
        {
            userId: user.id,
        }
    ];

    if (req.user) {
        Memory.findAndCountAll(filters)
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

// This is here for test purpose only 18.5.2020 / RS
memoryRouter.get('/reports/:id', function(req, res) {
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
            logger.error(err);
            res.send(err);
        });
});

// Not in use but do not delete yet  18.5.2020 / RS
memoryRouter.get('/reportedDistinct', function(req, res) {
    Report.findAndCountAll({
        attributes: [
        // specify an array where the first element is the SQL function and the second is the alias
        [sequelize.fn('DISTINCT', sequelize.col('memoryId')), 'memoryId']

        // specify any additional columns
        //'title'
    ]})
        .then(reports => {
            if (reports.count != 0) {
                logger.info(`sending list of distinct reported memory ids to client`);
                //const asa = reports.valueOf();
                //const memoryIds = JSON.parse(asa);


                res.status(HttpStatus.OK).send(reports);
            } else {
                throw 'No reported memories.';
            }
        })
        .catch(function(err) {
            logger.error(err);
            res.send(err);
        });
});

/**
 * API (GET) : getReportedMemories
 */

memoryRouter.get('/reportedMemories', function(req, res) {
    let filters = {
        order: [['id', 'ASC']],
    };

    filters.include = [
        {
            model: User,
            required: false,
            attributes: ['userName', 'displayName']
        },
        {
            model: Report,
            required: true,
            attributes: ['id','description','memoryId','createdAt','updatedAt', 'invalid']
        }
    ];

    filters.distinct = true;
    filters.where = {
        archiveDate: null
    };

    //Obtain GET request parameters
    //filter by category
//    let categoriesParam = req.query.categoryId;
//    if (categoriesParam) {
//        let categoryIdList = categoriesParam.split(',');
//        filters.where = { categoryId: { [Op.or]: categoryIdList } };
//    }

    //filter by category
//    let page = req.query.page;
//    if (page) {
//        let maxPerRequest = 10;
//        filters.offset = page * maxPerRequest;
//        filters.limit = maxPerRequest;
//    }

    logger.info(filters);
    Memory.findAndCountAll(filters)
        .then(memories => {
            logger.info(`sending ${memories.count} reported memories to client - ${req.originalUrl} - ${req.method} - ${req.ip}`)
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

module.exports = memoryRouter;
