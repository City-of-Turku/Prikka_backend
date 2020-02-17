/**
 * Category User
 *
 * COLUMNS
 * (pk) id           : int autoincrement (autogenerated)
 *      username     : string
 *      email        : text
 *      passwordhash : char(60)
 *      googleID     : char(24) null
 *      facebookID   : bigint null
 *      createdAt    : datetime          (autogenerated)
 *      updatedAt    : datetime          (autogenerated)
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const User = sequelize.define(
    'User',
    {
        // Model attributes are defined here
        // No need to put id, it's automatic integer autoincrement
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'This username is taken',
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
            unique: {
                args: true,
                msg: 'Email address already in use!',
            },
        },
        passwordhash: {
            type: DataTypes.CHAR(60),
            allowNull: false,
            validate: {
                min: {
                    args: 6,
                    msg: 'Password has to be minimum 6 characters',
                },
            },
        },
        googleId: {
            type: DataTypes.CHAR(24),
            // allowNull defaults to true
        },
        facebookId: {
            type: DataTypes.BIGINT.UNSIGNED,
            // allowNull defaults to true
        },
    },
    {
        // Other model options go here
        timestamps: true, // automatically adds the fields createdAt and updatedAt to model
        // createdAt: false // if I don't want createdAt
        //updatedAt: 'updateTimestamp'// I want updatedAt to actually be called updateTimestamp
    }
);

module.exports = User;
