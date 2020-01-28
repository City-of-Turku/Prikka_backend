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
  }



  },{
    timestamps: false
  });
  Memory.associate = function(models) {
    // associations can be defined here
    Memory.belongsTo(models.Category,{
      foreignkey: 'CategoryId',
    });
    Memory.belongsTo(models.User,{
      foreignkey: 'UserId',
    });
    
  };
  return Memory;
};