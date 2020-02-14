import { Model } from 'sequelize'

export class Category extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize, // We need to pass the connection instance
        modelName: 'Category', // We need to choose the model name
        timestamps: true,
        updatedAt: false, // we don't want updatedAt
      },
    )
  }
}
