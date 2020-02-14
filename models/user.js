import { Model } from 'sequelize'

export class User extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        // Model attributes are defined here
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
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            min: {
              args: 6,
              msg:
                'Password has to be minimum 6 characters',
            },
          },
        },
        googleId: {
          type: DataTypes.INTEGER,
          // allowNull defaults to true
        },
        facebookId: {
          type: DataTypes.INTEGER,
          // allowNull defaults to true
        },
      },
      {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'User', // We need to choose the model name
        timestamps: true, // automatically adds the fields createdAt and updatedAt to model
        // createdAt: false // if I don't want createdAt
        //updatedAt: 'updateTimestamp'// I want updatedAt to actually be called updateTimestamp
      },
    )
  }
}
