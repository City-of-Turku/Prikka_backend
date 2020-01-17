const sequelize = require("sequelize");


const Memories = sequelize.define('memories', {
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
