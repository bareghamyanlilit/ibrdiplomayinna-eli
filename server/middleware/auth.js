// JWT-i ev Admin model-i berdumn
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Middleware, vor verificum e request-i Bearer token-y
module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  // Ethe Authorization header-y baci e kkam sksnum e Bearer-ov, veradardzenq 401
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Unauthorized' });

  try {
    // Token-y hanumek header-ic ev verificenk JWT_SECRET-ov
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    // Gtenk admin-in bazayum id-ov (gaxtnabary chi veradardzenq)
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) return res.status(401).json({ message: 'Admin not found' });
    // Token-y vaverakan e, ancdnenq hajtord middleware kkam route-in
    next();
  } catch {
    // Token-y sxal e kkam vercin e
    res.status(401).json({ message: 'Invalid token' });
  }
};
