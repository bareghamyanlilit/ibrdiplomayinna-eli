const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  try {
    const token = auth.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    );

    const admin = await Admin.findById(decoded.id)
      .select('-password');

    if (!admin) {
      return res.status(401).json({
        message: 'Admin not found',
      });
    }

    req.admin = admin;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired',
      });
    }

    return res.status(401).json({
      message: 'Invalid token',
    });
  }
};