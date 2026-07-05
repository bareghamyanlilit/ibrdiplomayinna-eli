const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const StaffMember = require('../models/StaffMember');
const auth = require('../middleware/auth');

// Uploads papki stexcum ethe chka
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Mek lusankar upload-i hamar (anjnakazci nkar)
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET / — bolor anjnakazce stanel, dasavoracvac category ev order-ov (hamajvergi hamar)
router.get('/', async (req, res) => {
  try {
    const items = await StaffMember.find().sort({ category: 1, order: 1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /:id — mi anjnakazci stanel id-ov
router.get('/:id', async (req, res) => {
  try {
    const item = await StaffMember.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST / — nory anjnakazci avclacnel (autentificacum + mek nkari upload)
// src-y gali e nkaric kkam req.body.src-ic (ethe upload chi eghel)
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const { name, descr, category, order } = req.body;
    const src = req.file ? `/uploads/${req.file.filename}` : (req.body.src || '');
    const item = await StaffMember.create({ name, descr, src, category, order: Number(order) || 0 });
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /:id — arsknacnem anjnakazci-in id-ov
// Ethe nor nkar chi upload-vac, pahenq egacy
router.put('/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    const { name, descr, category, order } = req.body;
    const existing = await StaffMember.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });
    const src = req.file ? `/uploads/${req.file.filename}` : (req.body.src || existing.src || '');
    const item = await StaffMember.findByIdAndUpdate(
      req.params.id,
      { name, descr, src, category, order: Number(order) || 0 },
      { new: true }
    );
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /:id — jnjel anjnakazci-in
router.delete('/:id', auth, async (req, res) => {
  try {
    await StaffMember.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
