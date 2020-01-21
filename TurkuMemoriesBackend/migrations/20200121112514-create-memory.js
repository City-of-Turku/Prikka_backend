'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Memories', {
      Title: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      MemoryId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      MemoryContent: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      MemoryDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      MemoryPublished: {
        type: Sequelize.DATE,
        allowNull: false
      },
      MemoryLatitude: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      MemoryLongtitude: {
        type: Sequelize.FLOAT,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Memories');
  }
};