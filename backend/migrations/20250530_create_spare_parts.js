const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SpareParts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      part_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT
      },
      unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      current_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      min_stock_level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10
      },
      category: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SpareParts');
  }
};
