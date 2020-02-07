
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

router.post('/', passport.authenticate('localRegister', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
}));
module.exports = router;