const express = require('express');
const Memory = require('../models/memory');
const Report = require('../models/report');
const Category = require('../models/category');
const HttpStatus = require('http-status-codes');
const passport = require('passport');

const memoryRouter = express.Router();


//middleware
const verifyToken = require('../middleware/verifyToken.js')
=======


/**
 * API (GET) : getAllMemories
 */
memoryRouter.get('/memories/:offset', function(req, res) {
    console.log(req.params);
    Memory.findAndCountAll({
        offset: 10,
        limit: 10,
        order: [['id', 'DESC']],
    })
        .then(memories => {
            res.status(HttpStatus.OK).send(memories);
        })
        .catch(function(err) {
            res.status(HttpStatus.NOT_FOUND).send(`Memories not found.`);
        });
});

/**
 * API (POST) : createMemory
 */
memoryRouter.post('/memories', function(req, res) {
    let memoryBody = req.body;
    Memory.create(memoryBody)
        .then(memory => {
            res.status(HttpStatus.CREATED).send(memory);
        })
        .catch(err => {
            console.log(err);
            res.status(HttpStatus.BAD_REQUEST).send(
                `Error while creating a memory.`
            );
        });
});



/**
 * API (GET) : getMemoryById
 */
memoryRouter.get('/memories/:id', function(req, res) {
    Memory.findByPk(req.params.id)
        .then(memory => {
            res.status(HttpStatus.OK).send(memory);
        })
        .catch(function(err) {
            res.status(HttpStatus.NOT_FOUND).send(err);
        });
});

/**
 * API (PUT) : updateMemoryById
 */
memoryRouter.put('/memories/:id', function(req, res) {
    Memory.findByPk(req.params.id)
        .then(memory => {
            let memoryBody = req.body;
            memory.update(memoryBody);
            res.send(memory);
        })
        .catch(function(err) {
            res.status(HttpStatus.NOT_FOUND).send(`Memory not found.`);
        });
});

/**
 * API (DELETE) : deleteMemoryById
 */
memoryRouter.delete('/memories/:id', [verifyToken, passport.authenticate('jwt', {session: false})], function(req, res) {
    let memoryId = req.params.id;
    let user = req.user;
    console.log(user.id)
    Memory.destroy({
        where: {
            id: memoryId,
            userId: user.id
        },
    })
        .then((result) => { // result changes between 0 and 1 if memory is found
            if (result) {
                // deleted memory
                res.status(HttpStatus.OK).send(`Deleted memory #${memoryId}`);
            } else {
                // memory not found
                res.status(HttpStatus.FORBIDDEN).send(`Forbidden`);
            }
        })
        .catch(err => {
            console.error(err);
        });
});


/**
 * API (POST) : createMemoryReport
 */
memoryRouter.post('/reports', async function(req, res) {
    let reportBody = req.body;
    Memory.findOne({
        where: {
            id: req.body.memoryId,
        },
    })
    .then(memory => {
        console.log("MEMORY FOUND")
        Report.findOne({
            where: {
                memoryId: req.body.memoryId,
                userId: req.body.userId,
            },
        })
            .then(report => {
                if (report == null) {
                    // If existing report on memory is not found, new report is created.
                    Report.create(reportBody)
                        .then(report => {
                            res.status(HttpStatus.CREATED).send(report);
                        })
                        .catch(function(err) {
                            console.log(err);
                            res;
                            throw 'Error creating report.';
                        });
                } else {
                    // If existing report on memory is found.
                    res;
                    throw 'Memory already reported by user.';
                }
            })
            .catch(function(err) {
                console.log(err);
                res.status(HttpStatus.BAD_REQUEST).send(err);
            }
        );
    })
    .catch(function(err) {
        console.log("MEMORY NOT FOUND")
        res.status(HttpStatus.BAD_REQUEST).send(err);
    })
});

/**
 * API (GET) : getMemoryReportsById
 */
memoryRouter.get('/reports/:id', function(req, res) {
    Report.findAndCountAll({
        where: {
            MemoryId: req.params.id,
        },
    })
        .then(reports => {
            if (reports.count != 0) {
                res.status(HttpStatus.OK).send(reports);
            } else {
                throw 'No reports on memory.';
            }
        })
        .catch(function(err) {
            res.send(err);
        });
});
/**
 * API (POST) : createCategory
 */
memoryRouter.post('/categories', function(req, res) {
    let categoryBody = req.body;
    Category.create(categoryBody)
        .then(category => {
            res.status(HttpStatus.CREATED).send(category);
        })
        .catch(err => {
            console.log(err);
            res.status(HttpStatus.BAD_REQUEST).send(
                `Error while creating a category.`
            );
        });
});

/**
 * API (GET) : getMemoriesByCategoryId
 */
memoryRouter.get('/categories/:id', function(req, res) {
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
            res.send(err);
        });
});

module.exports = memoryRouter;
