/**
 * How to : https://codewithhugo.com/using-es6-classes-for-sequelize-4-models/
 */

import Sequelize from 'sequelize'
import { User } from './User'
import { Category } from './Category'
import { Memory } from './Memory'
import { Report } from './Report'

// pass your sequelize config here
export const sequelize = new Sequelize(
  process.env['DATABASE_NAME'],
  process.env['DATABASE_USER'],
  process.env['DATABASE_PASSWORD'],
  {
    host: `${process.env['DATABASE_HOST']}`,
    port: 3306,
    dialect: 'mysql',
  },
)

const models = {
  User: User.init(sequelize, Sequelize),
  Category: Category.init(sequelize, Sequelize),
  Memory: Memory.init(sequelize, Sequelize),
  Report: Report.init(sequelize, Sequelize),
}

// Run `.associate` if it exists,
// ie create relationships in the ORM
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models))

export const db = {
  ...models,
  sequelize,
}
