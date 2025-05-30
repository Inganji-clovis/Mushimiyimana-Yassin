const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SparePart = require('../models/SparePart');

// Get all spare parts
router.get('/', auth, async (req, res) => {
    try {
        const spareParts = await SparePart.findAll();
        res.json(spareParts);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single spare part
router.get('/:id', auth, async (req, res) => {
    try {
        const sparePart = await SparePart.findByPk(req.params.id);
        if (!sparePart) {
            return res.status(404).json({ error: 'Spare part not found' });
        }
        res.json(sparePart);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create spare part
router.post('/', auth, async (req, res) => {
    try {
        const { part_number, name, description, category, unit_price } = req.body;
        const sparePart = await SparePart.create({
            part_number,
            name,
            description,
            category,
            unit_price
        });
        res.status(201).json(sparePart);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update spare part
router.put('/:id', auth, async (req, res) => {
    try {
        const sparePart = await SparePart.findByPk(req.params.id);
        if (!sparePart) {
            return res.status(404).json({ error: 'Spare part not found' });
        }
        await sparePart.update(req.body);
        res.json(sparePart);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete spare part
router.delete('/:id', auth, async (req, res) => {
    try {
        const sparePart = await SparePart.findByPk(req.params.id);
        if (!sparePart) {
            return res.status(404).json({ error: 'Spare part not found' });
        }
        await sparePart.destroy();
        res.json({ message: 'Spare part deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
