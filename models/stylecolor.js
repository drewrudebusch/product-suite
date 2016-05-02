'use strict';
module.exports = function(sequelize, DataTypes) {
  var styleColor = sequelize.define('styleColor', {
    styleColorName: DataTypes.STRING,
    description: DataTypes.STRING,
    color: DataTypes.STRING,
    vendor: DataTypes.STRING,
    vendorStyleColorId: DataTypes.STRING,
    gender: DataTypes.STRING,
    countryOfOrigin: DataTypes.STRING,
    styleFamilyId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.styleColor.belongsTo(models.styleFamily);
        models.styleColor.hasMany(models.product);
      }
    }
  });
  return styleColor;
};