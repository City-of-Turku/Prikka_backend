const express = require('express')
const Memory = require('../models/Db').Memory
const Report = require('../models/Db').Report
const HttpStatus = require('http-status-codes')

export const memoryRouter = express.Router()

/**
 * API (POST) : createMemory
 */
memoryRouter.post('/memories', function(req, res) {
  let memoryBody = req.body
  Memory.create(memoryBody)
    .then(memory => {
      res.status(HttpStatus.CREATED).send(memory)
    })
    .catch(function(err) {
      console.log(err)
      res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Error while creating a memory.`)
    })
})

/**
 * API (GET) : getMemoryById
 */
memoryRouter.get('/memories/:id', function(req, res) {
  Memory.findByPk(req.params.id)
    .then(memory => {
      res.status(HttpStatus.OK).send(memory)
    })
    .catch(function(err) {
      res.status(HttpStatus.NOT_FOUND).send(err)
    })
})

/**
 * API (PUT) : updateMemoryById
 */
memoryRouter.put('/memories/:id', function(req, res) {
  Memory.findByPk(req.params.id)
    .then(memory => {
      let memoryBody = req.body
      memory.update(memoryBody)
      res.send(memory)
    })
    .catch(function(err) {
      res
        .status(HttpStatus.NOT_FOUND)
        .send(`Memory not found.`)
    })
})

/**
 * API (DELETE) : deleteMemoryById
 */

//TODO

/**
 * API (GET) : getAllMemories
 */
memoryRouter.get('/memories', function(req, res) {
  Memory.findAll()
    .then(memories => {
      res.status(HttpStatus.OK).send(memories)
    })
    .catch(function(err) {
      res
        .status(HttpStatus.NOT_FOUND)
        .send(`Memories not found.`)
    })
})

/**
 * API (GET) : getMemoriesByTag
 */

//TODO

/**
 * API (POST) : createMemoryReport
 */
memoryRouter.post('/reports', async function(req, res) {
  let reportBody = req.body
  Report.findOne({
    where: {
      memoryId: req.body.memoryId,
      userId: req.body.userId,
    },
  })
    .then(report => {
      if (report == null) {
        // If existing report on memory is not found, new report is created.
        Report.create(reportBody)
          .then(report => {
            res.status(HttpStatus.CREATED).send(report)
          })
          .catch(function(err) {
            console.log(err)
            res
            throw 'Error creating memory.'
          })
      } else {
        // If existing report on memory is found.
        res
        throw 'Memory already reported by user.'
      }
    })
    .catch(function(err) {
      console.log(err)
      res.status(HttpStatus.BAD_REQUEST).send(err)
    })
})

/**
 * API (GET) : getMemoryReportsById
 */
memoryRouter.get('/reports/:id', function(req, res) {
  Report.findAndCountAll({
    where: {
      memoryId: req.params.id,
    },
  })
    .then(reports => {
      console.log('fadfas')
      if (reports.count != 0) {
        res.status(HttpStatus.OK).send(reports)
      } else {
        throw 'No reports on memory.'
      }
    })
    .catch(function(err) {
      res.send(err)
    })
})
