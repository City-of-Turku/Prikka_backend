
const crypto = require('crypto');
const express = require('express');
const resetPasswordRouter = express.Router();
const nodemailer = require('nodemailer');
const User = require('../models').User;


resetPasswordRouter.post('/', (req, res) => {
    if(req.body.email == '') {
        res.status(400).send('email required');
    }
    console.log(req.body)
    console.error(req.body.email, 'moi');
    User.findOne({
        where: {
            email: req.body.email,
        },
    }).then((user) => {
        if (user == null) {
            console.error('email not in database');
            res.status(403).send('email. not in db');
        } else {
            const token = crypto.randomBytes(20).toString('hex');
            user.update({
                resetPasswordToken: token,
                resetPasswordExpires: Date.now() + 360000,
            });

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: process.env['EMAIL_ADDRESS'],
                    password: process.env['EMAIL_PASSWORD'],
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const mailOptions = {
                from: 'myturkumemories@gmail.com',
                to: req.body.email,
                subject: 'Reset password',
                text:
                    'Reset password with this link'
            };

        console.log('sending mail');

        transporter.sendMail(mailOptions, (err, response) => {
            if(err) {
                console.error('there was an error:', err);
            } else {
                console.log('here is the res: ', response);
                res.status(200).json('recovery email sent');
            }
        });
    }
    });
});

module.exports = resetPasswordRouter;