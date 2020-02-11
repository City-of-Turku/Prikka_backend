'use strict'

const env = require('dotenv').config()
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const db = {}

let sequelize

if (!env.error) {
  sequelize = new Sequelize(
    process.env['DATABASE_USER'],
    process.env['DATABASE_USER'],
    process.env['DATABASE_PASSWORD'],
    {
      host: 'remotemysql.com',
      dialect: 'mysql',
    },
  )
  console.log('Sequelize ok.')
} else {
  console.log('Sequelize error.')
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    )
  })
  .forEach(file => {
    const model = sequelize['import'](
      path.join(__dirname, file),
    )
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
