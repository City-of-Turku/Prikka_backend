const express = require('express');
const Campaign = require('../models/campaign');
const HttpStatus = require('http-status-codes');

// logger
const logger = require('../config/winston');

const campaignRouter = express.Router();

/**
 * API (GET) : getAllCampaigns
 */
campaignRouter.get('/campaigns', function(req, res) {
    Campaign.findAndCountAll({
        attributes: ['id', 'titleEN', 'titleFI', 'titleSV', 'descriptionEN', 'descriptionFI', 'descriptionSV',
            'categoryId', 'createdAt'],
        where: { isPublic: true },
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

/**
 * API (GET) : getCampaignById
 */
campaignRouter.get('/campaigns/:id', function(req, res) {
    User.findByPk(userId, {
        where: {
            id: req.params.id,
            isPublic: true,
        },
    })
        .then(campaign => {
            if (campaign.count != 0) {
                res.status(HttpStatus.OK).send(campaign);
            } else {
                throw 'Campaign not found.';
            }
        })
        .catch(function(err) {
            logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            res.send(err);
        });
});

module.exports = campaignRouter;
