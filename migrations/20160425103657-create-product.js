'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productName: {
        type: Sequelize.STRING
      },
      vendorSKU: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.STRING
      },
      UPC: {
        type: Sequelize.STRING
      },
      cost: {
        type: Sequelize.DECIMAL(10,2)
      },
      retail: {
        type: Sequelize.DECIMAL(10,2)
      },
      MSRP: {
        type: Sequelize.DECIMAL(10,2)
      },
      styleColorId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('products');
  }
};