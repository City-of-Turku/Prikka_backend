const express = require('express');
const Memory = require('../models/memory');
const Report = require('../models/report');
const HttpStatus = require('http-status-codes');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn(
    '/api/auth-management/login'
);
const memoryRouter = express.Router();

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
memoryRouter.delete('/memories/:id', function(req, res) {
    let memoryId = req.params.id;
    Memory.destroy({
        where: {
            id: memoryId,
        },
    })
        .then((result) => { // result changes between 0 and 1 if memory is found
            if (result) {
                // deleted memory
                res.status(HttpStatus.OK).send(`Deleted memory #${memoryId}`);
            } else {
                // memory not found
                res.status(HttpStatus.OK).send(`Memory #${memoryId} not found, maybe it's already deleted`);
            }
        })
        .catch(err => {
            console.error(err);
        });
});
/**
 * API (GET) : getAllMemories
 */
memoryRouter.get('/memories', function(req, res) {
    console.log(req.user);
    Memory.findAll({
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
 * API (GET) : getMemoriesByTag
 */

//TODO

/**
 * API (POST) : createMemoryReport
 */
memoryRouter.post('/reports', async function(req, res) {
    let reportBody = req.body;
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
                        throw 'Error creating memory.';
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
        });
});

/**
 * API (GET) : getMemoryReportsById
 */
memoryRouter.get('/reports/:id', function(req, res) {
    Report.findAndCountAll({
        where: {
            memoryId: req.params.id,
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

module.exports = memoryRouter;
