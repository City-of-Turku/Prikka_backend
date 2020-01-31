'use strict';
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id: {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    memoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }},{
        timestamps: false
  });

  Report.associate = function(models) {
    // associations can be defined here
    Report.belongsTo(models.User,{
        foreignKey: 'userId',
    });
    Report.belongsTo(models.Memory,{
        foreignKey: 'memoryId'
    });
  };
  return Report;
};

