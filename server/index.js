// Payhanjakan modulneri berdumn
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Express aplikaciayi stexcum
const app = express();

// CORS-i karcavor parametnery (frontend-i ev admin-i URL-ery trvum en)
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'https://ibrdiplomayinna-eli.vercel.app',
    process.env.ADMIN_URL || 'https://ibrdiplomayinna-eli.vercel.app/admin',
  ],
  credentials: true,
}));
// JSON-i ev static faileri apahovum
app.use(express.json());
// /uploads papke haskanabar heracvum e static faileri hamar
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API route-nery
app.use('/api/auth', require('./routes/auth'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/news', require('./routes/news'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/chairs', require('./routes/chairs'));
app.use('/api/library', require('./routes/library'));
app.use('/api/admissions', require('./routes/admissions'));
app.use('/api/studentCouncil', require('./routes/studentCouncil'));

// MongoDB-in kapcum enq .env fayli MONGODB_URI-ov
mongoose
  .connect(process.env.MONGODB_URI )
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Servery kkangni PORT-i vra (lranaguyts` 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
