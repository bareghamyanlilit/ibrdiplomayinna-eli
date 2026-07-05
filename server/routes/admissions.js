const router = require('express').Router();
const AdmissionRow = require('../models/AdmissionRow');
const auth = require('../middleware/auth');

// GET / — dimordneri aghjusaki toleky stanel
// Karenq filtravorel type-ov (full kkam remote) query parameter-ov
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const items = await AdmissionRow.find(query).sort({ type: 1, order: 1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /:id — mi tol stanel id-ov
router.get('/:id', async (req, res) => {
  try {
    const item = await AdmissionRow.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST / — nory tol avclacnel aghjusaki mej (autentificacum petk e)
// Bolor dashes am/ru/en lezvov
router.post('/', auth, async (req, res) => {
  try {
    const b = req.body;
    const item = await AdmissionRow.create({
      specialty: { am: b.specialtyAm, ru: b.specialtyRu || '', en: b.specialtyEn || '' },
      educationBase: { am: b.educationBaseAm || '', ru: b.educationBaseRu || '', en: b.educationBaseEn || '' },
      qualification: { am: b.qualificationAm || '', ru: b.qualificationRu || '', en: b.qualificationEn || '' },
      subjects: { am: b.subjectsAm || '', ru: b.subjectsRu || '', en: b.subjectsEn || '' },
      duration: { am: b.durationAm || '', ru: b.durationRu || '', en: b.durationEn || '' },
      type: b.type || 'full',
      order: Number(b.order) || 0,
    });
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /:id — arsknacnem toly id-ov (autentificacum petk e)
router.put('/:id', auth, async (req, res) => {
  try {
    const b = req.body;
    const item = await AdmissionRow.findByIdAndUpdate(req.params.id, {
      specialty: { am: b.specialtyAm, ru: b.specialtyRu || '', en: b.specialtyEn || '' },
      educationBase: { am: b.educationBaseAm || '', ru: b.educationBaseRu || '', en: b.educationBaseEn || '' },
      qualification: { am: b.qualificationAm || '', ru: b.qualificationRu || '', en: b.qualificationEn || '' },
      subjects: { am: b.subjectsAm || '', ru: b.subjectsRu || '', en: b.subjectsEn || '' },
      duration: { am: b.durationAm || '', ru: b.durationRu || '', en: b.durationEn || '' },
      type: b.type || 'full',
      order: Number(b.order) || 0,
    }, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /:id — jnjel toly
router.delete('/:id', auth, async (req, res) => {
  try {
    await AdmissionRow.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
