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
  });

  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Memory,{
        foreignKey: 'id',
        as: 'memories',
    });
  };
  return User;
};