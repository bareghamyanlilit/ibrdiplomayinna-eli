const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Department = require('../models/Department');
const auth = require('../middleware/auth');

// Uploads papki stexcum ethe chka
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer — fail hamary max 50MB (masnagitvutyunnery video unen)
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// GET / — hryatarakac masnagitvutyunnery stanel, dashavorac order-ov (hamajvergi hamar)
router.get('/', async (req, res) => {
  try {
    const items = await Department.find({ isPublished: true }).sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}
});

// GET /admin — BOLOR masnagitvutyunnery admin-i hamar (autentificacum petk e)
router.get('/admin', auth, async (req, res) => {
  try {
    const items = await Department.find().sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}
});

// GET /:id — mi masnagitvutyun stanel id-ov
router.get('/:id', async (req, res) => {
  try {
    const item = await Department.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}
});

// POST / — nory masnagitvutyun stexcel (autentificacum + multi-file upload)
// childImg (mek nkar), video (mek fail), images (max 20)
// infoParts-y JSON e, parsoom enq req.body-ic
router.post('/', auth, upload.fields([
  { name: 'childImg', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'images', maxCount: 20 },
]), async (req, res) => {
  try {
    const b = req.body;
    const files = req.files || {};

    const infoParts = JSON.parse(b.infoParts || '{"title":{"am":""},"info":[]}');

    const dept = await Department.create({
      color: b.color || '#004471',
      title: { am: b.titleAm, ru: b.titleRu || '', en: b.titleEn || '' },
      descr: { am: b.descrAm || '', ru: b.descrRu || '', en: b.descrEn || '' },
      shortTitle: { am: b.shortTitleAm || '', ru: b.shortTitleRu || '', en: b.shortTitleEn || '' },
      video: files.video ? `/uploads/${files.video[0].filename}` : (b.videoUrl || ''),
      childImg: files.childImg ? `/uploads/${files.childImg[0].filename}` : (b.childImgUrl || ''),
      infoParts,
      images: files.images ? files.images.map(f => `/uploads/${f.filename}`) : [],
      partImgTitle: { am: b.partImgTitleAm || '', ru: b.partImgTitleRu || '', en: b.partImgTitleEn || '' },
      order: Number(b.order) || 0,
      isPublished: b.isPublished !== 'false',
    });
    res.status(201).json(dept);
  } catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}
});

// PUT /:id — arsknacnem masnagitvutyuny id-ov
// Pahum enq egac nkarnery (existingImages) ev avclacnum enq norery
router.put('/:id', auth, upload.fields([
  { name: 'childImg', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'images', maxCount: 20 },
]), async (req, res) => {
  try {
    const b = req.body;
    const files = req.files || {};
    const existing = await Department.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });

    const infoParts = JSON.parse(b.infoParts || JSON.stringify(existing.infoParts));
    const keptImages = b.existingImages ? (Array.isArray(b.existingImages) ? b.existingImages : [b.existingImages]) : [];
    const newImages = files.images ? files.images.map(f => `/uploads/${f.filename}`) : [];

    const update = {
      color: b.color || existing.color,
      title: { am: b.titleAm || existing.title.am, ru: b.titleRu || '', en: b.titleEn || '' },
      descr: { am: b.descrAm || '', ru: b.descrRu || '', en: b.descrEn || '' },
      shortTitle: { am: b.shortTitleAm || '', ru: b.shortTitleRu || '', en: b.shortTitleEn || '' },
      video: files.video ? `/uploads/${files.video[0].filename}` : (b.videoUrl || existing.video || ''),
      childImg: files.childImg ? `/uploads/${files.childImg[0].filename}` : (b.childImgUrl || existing.childImg || ''),
      infoParts,
      images: [...keptImages, ...newImages],
      partImgTitle: { am: b.partImgTitleAm || '', ru: b.partImgTitleRu || '', en: b.partImgTitleEn || '' },
      order: Number(b.order) || 0,
      isPublished: b.isPublished !== 'false',
    };

    const dept = await Department.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(dept);
  } catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}
});

// DELETE /:id — jnjel masnagitvutyuny
router.delete('/:id', auth, async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}
});

module.exports = router;
