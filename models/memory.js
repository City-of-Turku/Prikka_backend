import { Model } from 'sequelize'

export class Memory extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        title: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            min: {
              args: 4,
              msg: 'Content has to be minimum 4 characters',
            },
          },
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            min: {
              args: 10,
              msg:
                'Content has to be minimum 10 characters',
            },
          },
        },
        coordinates: {
          type: DataTypes.GEOMETRY('POINT'),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Memory',
        timestamps: true,
      },
    )
  }
  static associate(models) {
    this.hasOne(models.User, {
      foreignkey: {
        // name: 'myFooId'
        type: DataTypes.UUID,
      },
    })
    models.User.belongsTo(this)

    this.hasOne(models.Category, {
      foreignKey: {
        type: DataTypes.UUID,
      },
    })
    models.Category.belongsTo(this)
  }
}
