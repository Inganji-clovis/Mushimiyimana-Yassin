const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SparePart = sequelize.define('SparePart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    category: {
        type: DataTypes.STRING
    },
    unit_price: {
        type: DataTypes.DECIMAL(10, 2)
    },
    current_stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: true
});

module.exports = SparePart;
