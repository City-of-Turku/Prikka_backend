import { Model } from 'sequelize'

export class Report extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },

      {
        sequelize,
        modelName: 'Report',
        timestamps: true,
        updatedAt: false, // we don't want updatedAt
      },
    )
  }
  static associate(models) {
    this.hasOne(models.Memory, {
      foreignKey: {
        type: DataTypes.UUID,
      },
    })
    models.Memory.belongsTo(this)
  }
}
