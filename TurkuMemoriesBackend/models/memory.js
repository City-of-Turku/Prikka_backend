'use strict';
module.exports = (sequelize, DataTypes) => {
  const Memory = sequelize.define('Memory', {
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        min: {
          args: 4,
          msg: "Content has to be minimum 4 characters"
        }
      }
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    published: {
      type: DataTypes.DATE,
      defaultValue: sequelize.DATE
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    longtitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    }}, {
      timestamps: false
  });
  Memory.associate = function (models) {
    // associations can be defined here
    Memory.belongsTo(models.Category, {
      foreignkey: 'categoryId',
    });
    Memory.belongsTo(models.User, {
      foreignkey: 'userId',
    });
    Memory.hasMany(models.Report, {
      foreignKey: 'id',
      as: 'reports',
    });

  }
  return Memory;
};

