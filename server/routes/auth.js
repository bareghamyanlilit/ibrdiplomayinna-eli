const router = require('express').Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/auth');

const resetCodes = {};

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendCode = async (email, code) => {
  await transporter.sendMail({
    from: `"ԷՊՔ Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verification Code - ԷՊՔ Admin',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:400px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#004471;margin-bottom:8px;">ԷՊՔ Admin</h2>
        <p style="color:#374151;">Ձեր verification կոդն է.</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#004471;text-align:center;padding:16px 0;">${code}</div>
        <p style="color:#6b7280;font-size:13px;">Կոդը վավեր է 10 րոպե:</p>
      </div>
    `,
  });
};

// POST /api/auth/register
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

// POST /api/auth/login
// Ճիշտ email+password → token
// Սխալ password → կոդ ուղարկել email-ին, վերադարձնել wrong_password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const passwordOk = await admin.comparePassword(password);

    if (!passwordOk) {
      const code = crypto.randomInt(100000, 999999).toString();
      resetCodes[email] = { code, expiresAt: Date.now() + 10 * 60 * 1000 };
      await sendCode(email, code);
      return res.status(401).json({ message: 'wrong_password', email });
    }

    const token = signToken(admin._id);
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/send-code
// Email-ով կոդ ուղարկել (login page-ի "Ուղարկել կոդ" կոճակից)
router.post('/send-code', async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Email not found' });

    const code = crypto.randomInt(100000, 999999).toString();
    resetCodes[email] = { code, expiresAt: Date.now() + 10 * 60 * 1000 };
    await sendCode(email, code);

    res.json({ message: 'Code sent', email });
  } catch (err) {
    console.error('send-code error:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login-with-code
// Կոդով մուտք (password-ի կարիք չկա)
router.post('/login-with-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    const entry = resetCodes[email];

    if (!entry) return res.status(400).json({ message: 'Կոդ չի գտնվել' });
    if (Date.now() > entry.expiresAt) {
      delete resetCodes[email];
      return res.status(400).json({ message: 'Կոդի ժամկետը լրացել է' });
    }
    if (entry.code !== code) return res.status(400).json({ message: 'Սխալ կոդ' });

    delete resetCodes[email];

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    const token = signToken(admin._id);
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    console.error('login-with-code error:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/verify-code
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    const entry = resetCodes[email];
    if (!entry) return res.status(400).json({ message: 'No code found for this email' });
    if (Date.now() > entry.expiresAt) {
      delete resetCodes[email];
      return res.status(400).json({ message: 'Code expired' });
    }
    if (entry.code !== code) return res.status(400).json({ message: 'Invalid code' });
    res.json({ message: 'ok' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const entry = resetCodes[email];
    if (!entry) return res.status(400).json({ message: 'No code found' });
    if (Date.now() > entry.expiresAt) {
      delete resetCodes[email];
      return res.status(400).json({ message: 'Code expired' });
    }
    if (entry.code !== code) return res.status(400).json({ message: 'Invalid code' });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });
    admin.password = newPassword;
    await admin.save();
    delete resetCodes[email];
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Email not found' });

    const code = crypto.randomInt(100000, 999999).toString();
    resetCodes[email] = { code, expiresAt: Date.now() + 10 * 60 * 1000 };
    await sendCode(email, code);

    res.json({ message: 'Code sent', email });
  } catch (err) {
    console.error('forgot-password error:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  res.json(req.admin);
});

module.exports = router;
