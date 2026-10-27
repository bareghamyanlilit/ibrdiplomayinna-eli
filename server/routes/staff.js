
const router = require('express').Router();
const StaffMember = require('../models/StaffMember');
const auth = require('../middleware/auth');

// GET / — բոլոր աշխատակիցները
router.get('/', async (req, res) => {
    try {
        const items = await StaffMember.find().sort({
            category: 1,
            order: 1,
        });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /:id — մեկ աշխատակից
router.get('/:id', async (req, res) => {
    try {
        const item = await StaffMember.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Not found' });
        }

        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST / — նոր աշխատակից
router.post('/', auth, async (req, res) => {
    try {
        const { name, descr, category, order, src } = req.body;

        const item = await StaffMember.create({
            name,
            descr,
            src: src || '',
            category,
            order: Number(order) || 0,
        });

        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /:id — խմբագրել աշխատակցին
router.put('/:id', auth, async (req, res) => {
    try {
        const existing = await StaffMember.findById(req.params.id);

        if (!existing) {
            return res.status(404).json({ message: 'Not found' });
        }

        const { name, descr, category, order, src } = req.body;

        const item = await StaffMember.findByIdAndUpdate(
            req.params.id,
            {
                name: name ?? existing.name,
                descr: descr ?? existing.descr,
                src: src ?? existing.src ?? '',
                category: category ?? existing.category,
                order:
                    order !== undefined
                        ? Number(order) || 0
                        : existing.order,
            },
            { new: true, runValidators: true }
        );

        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /:id — ջնջել աշխատակցին
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await StaffMember.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Not found' });
        }

        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
