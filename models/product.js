"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      product.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "userId",
        },
      });
    }
  }
  product.init(
    {
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      buy_price: DataTypes.INTEGER,
      sell_price: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "product",
    }
  );
  return product;
};
