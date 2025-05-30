const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const SparePart = require('./SparePart');

const StockOut = sequelize.define('StockOut', {
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
    issued_to: {
        type: DataTypes.STRING
    },
    issue_date: {
        type: DataTypes.DATE
    },
    purpose: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true
});

// Associations
StockOut.belongsTo(SparePart, {
    foreignKey: 'part_id',
    onDelete: 'CASCADE'
});

module.exports = StockOut;
