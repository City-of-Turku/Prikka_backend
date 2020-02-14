var express = require('express')

export const indexRouter = express.Router()

/* GET home page. */
indexRouter.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
})
