'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    passwordhash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
  });

  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Memory,{
        foreignKey: 'memoryId',
        as: 'memories',
    });
  };
  return User;
};