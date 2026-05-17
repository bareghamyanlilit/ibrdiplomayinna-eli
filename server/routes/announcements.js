const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Announcement = require('../models/Announcement');
const auth = require('../middleware/auth');

// Uploads papki stexcum, ethe chka
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer-i karcavor konfiguraciya — fayl anvanacum enq Date.now() + bnagir anun
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
// Fail hamary skagicel 10MB-ov
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET / — hryatarakac haytararutyunnery stanel (hamajvergi hamar)
router.get('/', async (req, res) => {
  try {
    const items = await Announcement.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /admin — BOLOR haytararutyunnery stanel (admin panel-i hamar, autentificacum petk e)
router.get('/admin', auth, async (req, res) => {
  try {
    const items = await Announcement.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /:id — mi haytararutyun stanel id-ov (hamajvergi hamar)
router.get('/:id', async (req, res) => {
  try {
    const item = await Announcement.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / — nory haytararutyun stexcel (autentificacum + nkarneri upload petk e)
// am/ru/en vercnagrer, bovan, video URL, upToDate, hryatarakutyun
router.post('/', auth, upload.array('images', 20), async (req, res) => {
  try {
    const { titleAm, titleRu, titleEn, contentAm, contentRu, contentEn, video, upToDate, isPublished } = req.body;
    const images = req.files?.map((f) => `/uploads/${f.filename}`) || [];
    const item = await Announcement.create({
      title: { am: titleAm, ru: titleRu || '', en: titleEn || '' },
      content: { am: contentAm, ru: contentRu || '', en: contentEn || '' },
      video: video || '',
      images,
      upToDate: upToDate || '',
      isPublished: isPublished !== 'false',
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id — arsknacnem haytararutyuny id-ov
// existingImages — nkarnery vor petk e paahel, nornery klcavor upload-i hamar
router.put('/:id', auth, upload.array('images', 20), async (req, res) => {
  try {
    const { titleAm, titleRu, titleEn, contentAm, contentRu, contentEn, video, upToDate, isPublished, existingImages } = req.body;
    const newImages = req.files?.map((f) => `/uploads/${f.filename}`) || [];
    const kept = existingImages ? (Array.isArray(existingImages) ? existingImages : [existingImages]) : [];
    const images = [...kept, ...newImages];

    const item = await Announcement.findByIdAndUpdate(
      req.params.id,
      {
        title: { am: titleAm, ru: titleRu || '', en: titleEn || '' },
        content: { am: contentAm, ru: contentRu || '', en: contentEn || '' },
        video: video || '',
        images,
        upToDate: upToDate || '',
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

// DELETE /:id — jnjel haytararutyuny id-ov (autentificacum petk e)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
