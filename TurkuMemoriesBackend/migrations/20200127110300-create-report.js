'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Reports', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING
            },
            memoryId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Memories',
                    key: 'id',
                    as: 'memoryId',
                },
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id',
                    as: 'userId',
                },
            }

        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Reports');
    }
};

