const sequelize = require("sequelize");


const Memories = sequelize.define('memories', {
    MemoryID: {
        type: DataTypes.INT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            min: {
                args: 4,
                msg: "Title has to be minimum 4 characters"
            }
            }
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
    }
})
