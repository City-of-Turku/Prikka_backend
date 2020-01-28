const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const router = express.Router();
const Memory = require('../models').Memory;
const HttpStatus = require('http-status-codes');


router.get('/all',
  function(req, res) {
  Memory.findAll()
    .then(memories => {
      res
      .status(HttpStatus.OK)
      .send(memories);
    });
});

router.get('/:id',
  function(req, res) {
    Memory.findByPk(req.params.id)
      .then(memory => {
        res
        .status(HttpStatus.OK)
        .send(memory);
      }).catch(function (err){ res
        .status(HttpStatus.NOT_FOUND)
        .send(`Memory not found.`)}); 
});

router.post('/create',
  function(req,res) {
    console.log(req.body);
    let memoryBody = req.body;
    Memory.create(memoryBody)
    .then(res
      .status(HttpStatus.CREATED)
      .send(memoryBody)).catch(function (err){ res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Error while creating a memory.`)});
  });

  module.exports = router;
  