const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/auth');

// JWT token-i stexcum admin-i id-ov (vajerakan 7 or)
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

// POST /api/auth/register — nory admin gracel
// Verificenk email-y unique e, apelov stexcenk admin, veradardzenq token
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await Admin.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });
    const admin = await Admin.create({ name, email, password });
    const token = signToken(admin._id);
    res.status(201).json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login — mутq admin-i hasteri hamar
// Gtnenq admin-in email-ov, verificenq gaxtnabary, veradardzenq token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(400).json({ message: 'Invalid credentials' });
    const token = signToken(admin._id);
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me — veradardzenq aylteq autentificacvac admin-in (token-i hamar)
router.get('/me', authMiddleware, (req, res) => {
  res.json(req.admin);
});

module.exports = router;
