'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }},{
      timestamps: false
  });
  Category.associate = function(models) {
    // associations can be defined here
    Category.hasMany(models.Memory,{
      foreignKey: 'id',
      as: 'memories',
  });
  };
  return Category;
};

