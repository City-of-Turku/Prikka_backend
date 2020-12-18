const sequelize = require('../config/db').sequelize;
const User = require('./user');
const Category = require('./category');
const Memory = require('./memory');
const Report = require('./report');

const models = {
    User: User,
    Category: Category,
    Memory: Memory,
    Report: Report,
};

Object.keys(models).forEach(modelName => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

module.exports = models;
