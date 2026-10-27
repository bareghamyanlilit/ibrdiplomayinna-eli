
const router = require('express').Router();
const StudentCouncil = require('../models/studentCouncil');
const auth = require('../middleware/auth');

// GET all
router.get('/', async (req, res) => {
  try {
    const items = await StudentCouncil.find().sort({ order: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET by id
router.get('/:id', async (req, res) => {
  try {
    const item = await StudentCouncil.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE — նկարը նախապես վերբեռնվում է Cloudinary
router.post('/', auth, async (req, res) => {
  try {
    const { name, descr, position, order, src } = req.body;

    if (src && !/^https:\/\/res\.cloudinary\.com\//.test(src)) {
      return res.status(400).json({
        message: 'Նկարի Cloudinary URL-ն անվավեր է',
      });
    }

    const item = await StudentCouncil.create({
      name,
      descr,
      position,
      src: src || '',
      order: Number(order) || 0,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, descr, position, order, src } = req.body;

    const existing = await StudentCouncil.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Not found' });
    }

    if (src && !/^https:\/\/res\.cloudinary\.com\//.test(src)) {
      return res.status(400).json({
        message: 'Նկարի Cloudinary URL-ն անվավեր է',
      });
    }

    const item = await StudentCouncil.findByIdAndUpdate(
      req.params.id,
      {
        name: name ?? existing.name,
        descr: descr ?? existing.descr,
        position: position ?? existing.position,
        src: src ?? existing.src,
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

// DELETE — հեռացնում ենք MongoDB-ի գրառումը
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await StudentCouncil.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
