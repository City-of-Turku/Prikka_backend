var express = require('express');
var router = express.Router();

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
