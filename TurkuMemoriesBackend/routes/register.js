
const express = require('express');
const router = express.Router();
const passport = require('passport');

/* --- ENDPOINTS --- */
/**
 * (post) : '/'
 * Register the user, then redirect to /account page
 */
router.get('/', (req, res) => {
    res.render('register');
});

router.post('/', passport.authenticate('local-register', {
    successRedirect: '/',
    failureRedirect: 'register',
    failureFlash: true
}), function(req, res) {
    console.log("callback lolol")
});
module.exports = router;