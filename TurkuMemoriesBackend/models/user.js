'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isName:true,
        },
        unique: {
          args: true,
          msg: 'This username is taken'
        }
    },
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail:true
        },
        unique: {
          args: true,
          msg: 'Email address already in use!'
        }
    },
    passwordhash: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: {
              args: 6,
              msg: "Password has to be minimum 6 characters"
          }
          }
    },
    googleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    facebookId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }},{
      timestamps: false
  });

  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Memory,{
        foreignKey: 'id',
        as: 'memories',
    });
    User.hasMany(models.Report),{
        foreignKey: 'id',
        as: 'reportsPosted'
    }
  };
  return User;
};