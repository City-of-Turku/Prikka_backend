const express = require('express');
const router = express.Router();
const Mailgun = require('mailgun-js');
const User = require('../models/User');
const bcrypt = ('bcryptjs');


router.post('/resetpassword', (req,res,next) => {

    //find user
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) {
            return next(err);
        }

        //if it doesn't exist
        if(user == null) {
            return next(new Error("User doesn't exist"));
        }

        //generate nonce and set time (to check validity < 24h)
        user.nonce = randomString(12);
        user.passwordResetTime = new Date();
        user.save();

        //Mailgun api configuration
        const mailgun = Mailgun({
            apiKey: '3b583c8145e844c62c4ed4dfe726e40f-713d4f73-bf68ed5e',
            domain: 'sandbox135ec95c12184216970220ca2d27785b.mailgun.org'
        });

        const data = {
            to: req.body.email,
            from: 'myturkumemories@gmail.com',
            sender: 'MyTurkuMemories',
            subject: 'Password Reset Request',
            html: 'trolololoo'

        };
        
    })
})