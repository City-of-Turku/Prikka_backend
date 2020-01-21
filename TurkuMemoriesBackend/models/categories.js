const sequelize = require("sequelize");


const Memories = sequelize.define('categories', {
    CategoryID: {
        type: DataTypes.INT,
        allowNull: false,
    },
    CategoryName: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            min: {
                args: 4,
                msg: "Content has to be minimum 4 characters"
            }
            }
    }
})