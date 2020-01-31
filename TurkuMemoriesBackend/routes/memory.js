const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const router = express.Router();
const Memory = require('../models').Memory;
const Report = require('../models').Report;
const HttpStatus = require('http-status-codes');


router.get('/all',
  function (req, res) {
    Memory.findAll()
      .then(memories => {
        res
          .status(HttpStatus.OK)
          .send(memories);
      }).catch(function (err) {
        res
          .status(HttpStatus.NOT_FOUND)
        .send(`Memory not found.`)
      });
  });

router.get('/:id',
  function (req, res) {
    Memory.findByPk(req.params.id)
      .then(memory => {
        res
          .status(HttpStatus.OK)
          .send(memory);
      }).catch(function (err) {
        res
          .status(HttpStatus.NOT_FOUND)
          .send(`Memory not found.`)
      });
  });

router.post('/memory',
  function (req, res) {
    let memoryBody = req.body
    Memory.create(memoryBody)
      .then(memory => {
        res
          .status(HttpStatus.CREATED)
          .send(memory);
  }).catch(function (err) {
    console.log(err);
    res
      .status(HttpStatus.BAD_REQUEST)
      .send(`Error while creating a memory.`)
  });
  });


router.put('/update_:id',
  function (req, res) {
    Memory.findByPk(req.params.id)
      .then(memory => {
        let memoryBody = req.body
        memory.update(memoryBody)
        res
          .send(memory)
      }).catch(function (err) {
        res
          .status(HttpStatus.NOT_FOUND)
        .send(`Memory not found.`)
      });
  });

router.post('/report',
  function (req, res) {
    let reportBody = req.body;
    Report.create(reportBody)
      .then(report => {
        res
          .status(HttpStatus.CREATED)
          .send(report)
      }).catch(function (err) {
        console.log(err);
        res
          .status(HttpStatus.BAD_REQUEST)
          .send(`Error while reporting.`)
      });      
});

module.exports = router;
