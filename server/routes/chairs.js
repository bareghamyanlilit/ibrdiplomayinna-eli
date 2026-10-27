
const router = require('express').Router();
const Chair = require('../models/Chair');
const auth = require('../middleware/auth');

const normalizeStaff = (staff) => {
    if (Array.isArray(staff)) return staff;
    if (typeof staff === 'string') {
        try {
            const parsed = JSON.parse(staff);
            if (Array.isArray(parsed)) return parsed;
        } catch {}

        return staff.split('\n').filter(Boolean);
    }
    return [];
};

// GET / — բոլոր ամբիոնները
router.get('/', async (req, res) => {
    try {
        const items = await Chair.find().sort({ order: 1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /:id — մեկ ամբիոն
router.get('/:id', async (req, res) => {
    try {
        const item = await Chair.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Not found' });
        }

        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST / — նոր ամբիոն
router.post('/', auth, async (req, res) => {
    try {
        const b = req.body;

        const item = await Chair.create({
            title: {
                am: b.titleAm || '',
                ru: b.titleRu || '',
                en: b.titleEn || '',
            },
            descr: {
                am: b.descrAm || '',
                ru: b.descrRu || '',
                en: b.descrEn || '',
            },
            img: b.imgUrl || '',
            boss: {
                name: b.bossName || '',
                descr: b.bossDescr || '',
                src: b.bossSrc || '',
            },
            staff: normalizeStaff(b.staff),
            order: Number(b.order) || 0,
        });

        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /:id — խմբագրել ամբիոնը
router.put('/:id', auth, async (req, res) => {
    try {
        const b = req.body;
        const existing = await Chair.findById(req.params.id);

        if (!existing) {
            return res.status(404).json({ message: 'Not found' });
        }

        const item = await Chair.findByIdAndUpdate(
            req.params.id,
            {
                title: {
                    am: b.titleAm ?? existing.title?.am ?? '',
                    ru: b.titleRu ?? existing.title?.ru ?? '',
                    en: b.titleEn ?? existing.title?.en ?? '',
                },
                descr: {
                    am: b.descrAm ?? existing.descr?.am ?? '',
                    ru: b.descrRu ?? existing.descr?.ru ?? '',
                    en: b.descrEn ?? existing.descr?.en ?? '',
                },
                img: b.imgUrl || existing.img || '',
                boss: {
                    name: b.bossName ?? existing.boss?.name ?? '',
                    descr: b.bossDescr ?? existing.boss?.descr ?? '',
                    src: b.bossSrc || existing.boss?.src || '',
                },
                staff:
                    b.staff !== undefined
                        ? normalizeStaff(b.staff)
                        : existing.staff,
                order:
                    b.order !== undefined
                        ? Number(b.order) || 0
                        : existing.order,
            },
            { new: true, runValidators: true }
        );

        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /:id — ջնջել ամբիոնը
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await Chair.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Not found' });
        }

        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
