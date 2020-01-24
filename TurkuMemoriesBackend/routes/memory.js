const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const router = express.Router();
//const db = require('../models/index.js');

router.get('/all',
  function(req, res) {
    //db.post.findAll().then( (result) => res.json(result) )
    res.render('index', '');
});


/*module.exports = (app, db) => {
    app.get( "/memories", (req, res) =>
      db.post.findAll().then( (result) => res.json(result) )
    );
  
    app.get( "/memory/:id", (req, res) =>
      db.post.findByPk(req.params.id).then( (result) => res.json(result))
    );
  
    app.post("/memory", (req, res) => 
      db.post.create({
        title: req.body.title,
        content: req.body.content
      }).then( (result) => res.json(result) )
    );

    router.get('/profile',
    function(req, res) {
        res.render('profile', {user: req.user});
});
  
    app.put( "/memory/:id", (req, res) =>
      db.post.update({
        title: req.body.title,
        content: req.body.content
      },
      {
        where: {
          id: req.params.id
        }
      }).then( (result) => res.json(result) )
    );
  
    app.delete( "/memory/:id", (req, res) =>
      db.post.destroy({
        where: {
          id: req.params.id
        }
      }).then( (result) => res.json(result) )
    );
  }*/
  module.exports = router;