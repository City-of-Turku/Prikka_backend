const sequelize = require('../config/db').sequelize
const User = require('./User')
const Category = require('./Category')
const Memory = require('./Memory')
const Report = require('./Report')

const models = {
  User: User,
  Category: Category,
  Memory: Memory,
  Report: Report,
}

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models)
  }
})

module.exports = models
