var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET users listing. */
router.get('/register', (req, res) => {
  res.render('register');
})

router.post('/register', passport.authenticate('local-register', {
    successRedirect: '/',
    failureRedirect: '/register'
  }
));

module.exports = router;
