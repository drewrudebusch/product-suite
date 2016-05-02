'use strict';
module.exports = function(sequelize, DataTypes) {
  var styleFamily = sequelize.define('styleFamily', {
    styleName: DataTypes.STRING,
    brand: DataTypes.STRING,
    vendorStyleId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.styleFamily.hasMany(models.styleColor);
      }
    }
  });
  return styleFamily;
};