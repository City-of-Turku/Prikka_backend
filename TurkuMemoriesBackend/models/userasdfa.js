const sequelize = require("sequelize");


const users = sequelize.define('users', {
    UserID: {
        type: DataTypes.INT,
        allowNull: false
    },
    UserName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    UserEmail: {
        type: DataTypes.STRING,
        allowNull: true
    },
    UserPasswordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
        min: {
            args: 6,
            msg: "Password must be more than 6 characters"
        }
        }
    }   

})