
const router = require('express').Router();
const Announcement = require('../models/Announcement');
const auth = require('../middleware/auth');

const parseImages = (value) => {
  if (value === undefined || value === null) return null;

  if (Array.isArray(value)) {
    return value.filter((url) => typeof url === 'string' && url.trim());
  }

  if (typeof value === 'string') {
    if (!value.trim()) return [];

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (url) => typeof url === 'string' && url.trim()
        );
      }
    } catch { }

    return [value];
  }

  return [];
};

// GET / — հրապարակված հայտարարություններ
router.get('/', async (req, res) => {
  try {
    const items = await Announcement.find({
      isPublished: true,
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /admin — բոլոր հայտարարությունները admin-ի համար
router.get('/admin', auth, async (req, res) => {
  try {
    const items = await Announcement.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /:id — մեկ հայտարարություն
router.get('/:id', async (req, res) => {
  try {
    const item = await Announcement.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / — ստեղծել հայտարարություն
router.post('/', auth, async (req, res) => {
  try {
    const b = req.body;

    const images = parseImages(b.images ?? b.existingImages) || [];

    const item = await Announcement.create({
      title: {
        am: b.titleAm || '',
        ru: b.titleRu || '',
        en: b.titleEn || '',
      },
      content: {
        am: b.contentAm || '',
        ru: b.contentRu || '',
        en: b.contentEn || '',
      },
      video: b.video || '',
      images,
      upToDate: b.upToDate || '',
      isPublished:
        b.isPublished === undefined
          ? true
          : b.isPublished === true || b.isPublished === 'true',
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id — խմբագրել հայտարարություն
router.put('/:id', auth, async (req, res) => {
  try {
    const b = req.body;
    const existing = await Announcement.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Not found' });
    }

    // Եթե frontend-ը նոր նկարների հետ ուղարկում է պահպանվող
    // նկարների ամբողջ ցանկը, օգտագործում ենք այդ ցանկը։
    // Եթե նկարների դաշտ չկա, պահպանում ենք նախկին նկարները։
    const images =
      parseImages(b.images ?? b.existingImages) ?? existing.images ?? [];

    const item = await Announcement.findByIdAndUpdate(
      req.params.id,
      {
        title: {
          am: b.titleAm ?? existing.title?.am ?? '',
          ru: b.titleRu ?? existing.title?.ru ?? '',
          en: b.titleEn ?? existing.title?.en ?? '',
        },
        content: {
          am: b.contentAm ?? existing.content?.am ?? '',
          ru: b.contentRu ?? existing.content?.ru ?? '',
          en: b.contentEn ?? existing.content?.en ?? '',
        },
        video: b.video ?? existing.video ?? '',
        images,
        upToDate: b.upToDate ?? existing.upToDate ?? '',
        isPublished:
          b.isPublished === undefined
            ? existing.isPublished
            : b.isPublished === true || b.isPublished === 'true',
      },
      { new: true, runValidators: true }
    );

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /:id — ջնջել հայտարարություն
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Announcement.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
