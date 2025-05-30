const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Report = require('../models/Report');
const SparePart = require('../models/SparePart');
const StockIn = require('../models/StockIn');
const StockOut = require('../models/StockOut');

// Generate stock movement report
router.post('/stock-movement', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        
        // Get stock movements
        const stockIn = await StockIn.findAll({
            where: {
                created_at: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [SparePart]
        });

        const stockOut = await StockOut.findAll({
            where: {
                created_at: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [SparePart]
        });

        // Create report
        const report = await Report.create({
            report_type: 'stock_movement',
            title: `Stock Movement Report (${startDate} to ${endDate})`,
            data: {
                stockIn,
                stockOut,
                period: { startDate, endDate }
            }
        });

        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate stock movement report' });
    }
});

// Generate value report
router.post('/value', auth, async (req, res) => {
    try {
        const { date } = req.body;
        
        // Get all spare parts with current stock
        const spareParts = await SparePart.findAll();
        
        // Calculate total value
        const totalValue = spareParts.reduce((sum, part) => {
            return sum + (part.current_stock * part.unit_price);
        }, 0);

        // Create report
        const report = await Report.create({
            report_type: 'value',
            title: `Stock Value Report (${date})`,
            data: {
                spareParts,
                totalValue,
                date
            }
        });

        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate value report' });
    }
});

// Generate low stock report
router.get('/low-stock', auth, async (req, res) => {
    try {
        // Get spare parts with low stock (less than 10 units)
        const spareParts = await SparePart.findAll({
            where: {
                current_stock: {
                    [Op.lte]: 10
                }
            }
        });

        // Create report
        const report = await Report.create({
            report_type: 'low_stock',
            title: 'Low Stock Alert Report',
            data: {
                spareParts,
                threshold: 10
            }
        });

        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate low stock report' });
    }
});

// Get all reports
router.get('/', auth, async (req, res) => {
    try {
        const reports = await Report.findAll({
            order: [['generated_at', 'DESC']]
        });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// Get specific report
router.get('/:id', auth, async (req, res) => {
    try {
        const report = await Report.findByPk(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch report' });
    }
});

module.exports = router;
