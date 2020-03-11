const express = require('express');
const Category = require('../models/category');
const HttpStatus = require('http-status-codes');

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
            console.log(err);
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
        order: [['name', 'ASC']],
    })
        .then(categories => {
            res.status(HttpStatus.OK).send(categories);
        })
        .catch(err => {
            console.log(err);
            res.status(HttpStatus.NOT_FOUND).send(`Categories not found.`);
        });
});

module.exports = categoryRouter;
