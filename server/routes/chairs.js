const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Chair = require('../models/Chair');
const auth = require('../middleware/auth');

// Uploads papki stexcum ethe chka
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Ambioni nkar ev nakhagahi lusankar upload-i hamar
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// GET / — bolor ambionnery stanel, dashavoracvac order-ov
router.get('/', async (req, res) => {
  try {
    const items = await Chair.find().sort({ order: 1 });
    res.json(items);
  } catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}
});
} catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}
// GET /:id — mi ambion stanel id-ov
router.get('/:id', async (req, res) => {
  try {
    const item = await Chair.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}
});

// POST / — nory ambion stexcel (autentificacum + nkar ev nakhagahi lusankar upload)
// staff-y gali e arrayic kkam newline-separated text-ic
router.post('/', auth, upload.fields([{ name: 'img', maxCount: 1 }, { name: 'bossPhoto', maxCount: 1 }]), async (req, res) => {
  try {
    const b = req.body;
    const files = req.files || {};
  } catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
} } catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}
    const item = await Chair.create({
      title: { am: b.titleAm, ru: b.titleRu || '', en: b.titleEn || '' },
      descr: { am: b.descrAm || '', ru: b.descrRu || '', en: b.descrEn || '' },
      img: files.img ? `/uploads/${files.img[0].filename}` : (b.imgUrl || ''),
      boss: {
        name: b.bossName || '',
        descr: b.bossDescr || '',
        src: files.bossPhoto ? `/uploads/${files.bossPhoto[0].filename}` : (b.bossSrc || ''),
      },
      staff: staffList,
      order: Number(b.order) || 0,
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}
});

// PUT /:id — arsknacnem ambion-y id-ov
//} catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}
ro} catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
  } catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}
}}} catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}
  try {
    const b = req.body;
    const files = req.files || {};
    const existing = await Chair.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });
    const staffList = b.staff ? (Array.isArray(b.staff) ? b.staff : b.staff.split('\n').filter(Boolean)) : [];
    const item = await Chair.findByIdAndUpdate(req.params.id, {
      title: { am: b.titleAm, ru: b.titleRu || '', en: b.titleEn || '' },
      descr: { am: b.descrAm || '', ru: b.descrRu || '', en: b.descrEn || '' },
      img: files.img ? `/uploads/${files.img[0].filename}` : (b.imgUrl || existing.img || ''),
      boss: {
        name: b.bossName || '',
  } catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}
        src: files.bossPhoto ? `/uploads/${files.bossPhoto[0].filename}` : (b.bossSrc || existing.boss?.src || ''),
      },
      staff: staffList,
      order: Number(b.order) || 0,
    }, { new: true });
    res.json(item);
  } catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}
})} catch (err) {
    console.error('UPDATE DEPARTMENT ERROR:', err);

    res.status(500).json({
        message: err.message,
        name: err.name,
    });
}

// DELETE /:id — jnjel ambion-y
router.delete('/:id', auth, async (req, res) => {
  try {
    await Chair.findByIdAndDelete(req.params.id);
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
