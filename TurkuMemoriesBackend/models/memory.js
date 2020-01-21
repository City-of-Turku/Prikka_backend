'use strict';
module.exports = (sequelize, DataTypes) => {
  const Memory = sequelize.define('Memory', {
    title: DataTypes.TEXT
  }, {});
  Memory.associate = function(models) {
    // associations can be defined here
  };
  return Memory;
};