const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const SparePart = require('./SparePart');

const StockIn = sequelize.define('StockIn', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    part_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SparePart,
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    purchase_price: {
        type: DataTypes.DECIMAL(10, 2)
    },
    supplier: {
        type: DataTypes.STRING
    },
    purchase_date: {
        type: DataTypes.DATE
    }
}, {
    timestamps: true
});

// Associations
StockIn.belongsTo(SparePart, {
    foreignKey: 'part_id',
    onDelete: 'CASCADE'
});

module.exports = StockIn;
