'use strict';
module.exports = (sequelize, DataTypes) => {
  const Memory = sequelize.define('Memory', {
    Title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    MemoryId: {
      type: DataTypes.INT,
      allowNull: false
    },
    CategoryId: {
      type: DataTypes.INT,
      allowNull: false
    },
    MemoryContent: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
          min: {
              args: 4,
              msg: "Content has to be minimum 4 characters"
          }
          }
  },
  MemoryDate: {
      type: DataTypes.DATE,
      allowNull: false
  },
  MemoryPublished: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW
  },
  MemoryLatitude: {
      type: DataTypes.FLOAT,
      allowNull: false
  },
  MemoryLongtitude: {
      type: DataTypes.FLOAT,
      allowNull: false
  }



  });
  Memory.associate = function(models) {
    // associations can be defined here
    Memory.belongsTo(models.User,{
      foreignkey: 'userId',
      as: 'user',
    });
    /*Memory.hasOne(models.Category,{
      foreignkey: 'categoryId',
      as: 'category',
    });*/

  };
  return Memory;
};