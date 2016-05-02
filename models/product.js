'use strict';
module.exports = function(sequelize, DataTypes) {
  var product = sequelize.define('product', {
    productName: DataTypes.STRING,
    vendorSKU: DataTypes.STRING,
    size: DataTypes.STRING,
    UPC: DataTypes.STRING,
    cost: DataTypes.DECIMAL(10,2),
    retail: DataTypes.DECIMAL(10,2),
    MSRP: DataTypes.DECIMAL(10,2),
    styleColorId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.product.belongsTo(models.styleColor);
      }
    }
  });
  return product;
};