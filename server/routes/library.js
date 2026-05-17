const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const LibraryFile = require('../models/LibraryFile');
const auth = require('../middleware/auth');

// Gradrani failery pahvenq /uploads/library/ mej (aylibanyagreri hamar)
const uploadDir = path.join(__dirname, '../uploads/library');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Fayli anvan maqrumabn — Cyrillic ev hayeren nkarnery pahum enq, spacenery kkam slash-ery poxum enq _-ov
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._\-\u0400-\u04FF\u0530-\u058F]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});
// Max 50MB (PDF failery meghi mec en linum)
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// GET / — hryatarakac failery stanel, karenq filtravorel masnagitvutyunov kkam paxtumov
router.get('/', async (req, res) => {
  try {
    const { specialty, search } = req.query;
    const query = { isPublished: true };
    if (specialty) query.specialty = specialty;
    if (search) query.name = { $regex: search, $options: 'i' };
    const items = await LibraryFile.find(query).sort({ specialty: 1, order: 1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /specialties — masnagitvutyunneri unique ternery stanel (dropdown hamar)
router.get('/specialties', async (req, res) => {
  try {
    const specialties = await LibraryFile.distinct('specialty', { isPublished: true });
    res.json(specialties.sort());
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /admin — bolor failery admin-i hamar (autentificacum petk e)
router.get('/admin', auth, async (req, res) => {
  try {
    const items = await LibraryFile.find().sort({ specialty: 1, order: 1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST / — nory fail upload anel (autentificacum petk e)
// name, specialty, order — meta-tvyalner; fail-y multer-y mshakum e
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { name, specialty, order } = req.body;
    const item = await LibraryFile.create({
      name: name || req.file.originalname,
      specialty: specialty || 'Ընդhanuр',
      fileName: req.file.originalname,
      filePath: `/uploads/library/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      order: Number(order) || 0,
    });
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /:id — arsknacnem meta-tvyalnery (name, specialty, order, isPublished)
// Nerc fail upload anel, kkam tolk meta poxel
router.put('/:id', auth, upload.single('file'), async (req, res) => {
  try {
    const { name, specialty, order, isPublished } = req.body;
    const existing = await LibraryFile.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });
    
    const update = {
      name: name || existing.name,
      specialty: specialty || existing.specialty,
      order: Number(order) || 0,
      isPublished: isPublished !== 'false',
    };
    // Ethe nor fail e upload-vac, arsknacnenq fayli informatsiay
    if (req.file) {
      update.fileName = req.file.originalname;
      update.filePath = `/uploads/library/${req.file.filename}`;
      update.fileSize = req.file.size;
      update.mimeType = req.file.mimetype;
    }
    const item = await LibraryFile.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /:id — jnjel DB-ic ev naev fizikakan fayl-y diskov vra
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await LibraryFile.findByIdAndDelete(req.params.id);
    if (item) {
      const fullPath = path.join(__dirname, '..', item.filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
