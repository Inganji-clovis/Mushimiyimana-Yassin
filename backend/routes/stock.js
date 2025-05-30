const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const StockIn = require('../models/StockIn');
const StockOut = require('../models/StockOut');
const SparePart = require('../models/SparePart');

// Stock In operations
router.post('/in', auth, async (req, res) => {
    try {
        const { part_id, quantity, purchase_price, supplier } = req.body;
        
        // Find spare part
        const sparePart = await SparePart.findByPk(part_id);
        if (!sparePart) {
            return res.status(404).json({ error: 'Spare part not found' });
        }

        // Create stock in record
        const stockIn = await StockIn.create({
            part_id,
            quantity,
            purchase_price,
            supplier
        });

        // Update spare part stock
        await sparePart.update({
            current_stock: sparePart.current_stock + quantity
        });

        res.status(201).json(stockIn);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add stock' });
    }
});

// Stock Out operations
router.post('/out', auth, async (req, res) => {
    try {
        const { part_id, quantity, issued_to, purpose } = req.body;
        
        // Find spare part
        const sparePart = await SparePart.findByPk(part_id);
        if (!sparePart) {
            return res.status(404).json({ error: 'Spare part not found' });
        }

        // Check if enough stock is available
        if (sparePart.current_stock < quantity) {
            return res.status(400).json({ error: 'Not enough stock available' });
        }

        // Create stock out record
        const stockOut = await StockOut.create({
            part_id,
            quantity,
            issued_to,
            purpose
        });

        // Update spare part stock
        await sparePart.update({
            current_stock: sparePart.current_stock - quantity
        });

        res.status(201).json(stockOut);
    } catch (error) {
        res.status(500).json({ error: 'Failed to issue stock' });
    }
});

// Get stock history
router.get('/history/:part_id', auth, async (req, res) => {
    try {
        const part_id = req.params.part_id;
        
        const stockIn = await StockIn.findAll({
            where: { part_id },
            order: [['created_at', 'DESC']]
        });

        const stockOut = await StockOut.findAll({
            where: { part_id },
            order: [['created_at', 'DESC']]
        });

        res.json({
            stockIn,
            stockOut
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stock history' });
    }
});

module.exports = router;
