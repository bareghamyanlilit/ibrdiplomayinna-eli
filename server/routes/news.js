const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const News = require('../models/News');
const auth = require('../middleware/auth');

// Uploads papki stexcum ethe chka
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Faylerov ashxatum e multer-y (timestamp + bnagir anun)
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET / — hryatarakac norutyunnery (hamajvergi hamar)
router.get('/', async (req, res) => {
  try {
    const items = await News.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /admin — bolor norutyunnery admin-i hamar (autentificacum petk e)
router.get('/admin', auth, async (req, res) => {
  try {
    const items = await News.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /:id — mi norutyun stanel id-ov
router.get('/:id', async (req, res) => {
  try {
    const item = await News.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / — nory norutyun avclacnel (autentificacum + nkarneri upload)
router.post('/', auth, upload.array('images', 20), async (req, res) => {
  try {
    const { titleAm, titleRu, titleEn, contentAm, contentRu, contentEn, video, isPublished } = req.body;
    const images = req.files?.map((f) => `/uploads/${f.filename}`) || [];
    const item = await News.create({
      title: { am: titleAm, ru: titleRu || '', en: titleEn || '' },
      content: { am: contentAm, ru: contentRu || '', en: contentEn || '' },
      video: video || '',
      images,
      isPublished: isPublished !== 'false',
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id — arsknacnem norutyuny id-ov
// Pahum enq egac nkarnery ev avclacnum enq norery
router.put('/:id', auth, upload.array('images', 20), async (req, res) => {
  try {
    const { titleAm, titleRu, titleEn, contentAm, contentRu, contentEn, video, isPublished, existingImages } = req.body;
    const newImages = req.files?.map((f) => `/uploads/${f.filename}`) || [];
    const kept = existingImages ? (Array.isArray(existingImages) ? existingImages : [existingImages]) : [];
    const images = [...kept, ...newImages];
    const item = await News.findByIdAndUpdate(
      req.params.id,
      {
        title: { am: titleAm, ru: titleRu || '', en: titleEn || '' },
        content: { am: contentAm, ru: contentRu || '', en: contentEn || '' },
        video: video || '',
        images,
        isPublished: isPublished !== 'false',
      },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /:id — jnjel norutyuny
router.delete('/:id', auth, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
