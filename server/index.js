
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

const app = express();

// Cloudinary-ի կարգավորումներ
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CORS
const allowedOrigins = [
    process.env.FRONTEND_URL || 'https://ibrdiplomayinna-eli.vercel.app',
    process.env.ADMIN_URL || 'https://ibrdiplomayinna-eli.vercel.app',
].map((url) => {
    try {
        return new URL(url).origin;
    } catch {
        return url;
    }
});

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json({ limit: '1mb' }));

// Cloudinary upload signature endpoint
const auth = require('./middleware/auth');

app.post('/api/uploads/sign', auth, (req, res) => {
    try {
        const { resourceType } = req.body;

        // Թույլատրում ենք միայն նկարներ և վիդեոներ
        if (!['image', 'video','raw'].includes(resourceType)) {
            return res.status(400).json({
                message: 'Անթույլատրելի ֆայլի տեսակ',
            });
        }

        if (
            !process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            return res.status(500).json({
                message: 'Cloudinary-ի կարգավորումները բացակայում են',
            });
        }

        const timestamp = Math.floor(Date.now() / 1000);
        const folder = 'departments';

        const signature = cloudinary.utils.api_sign_request(
            {
                folder,
                timestamp,
            },
            process.env.CLOUDINARY_API_SECRET
        );

        return res.json({
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            timestamp,
            signature,
            folder,
        });
    } catch (error) {
        console.error('Cloudinary signature error:', error);

        return res.status(500).json({
            message: 'Չհաջողվեց պատրաստել ֆայլի վերբեռնումը',
        });
    }
});

// API route-եր
app.use('/api/auth', require('./routes/auth'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/news', require('./routes/news'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/chairs', require('./routes/chairs'));
app.use('/api/library', require('./routes/library'));
app.use('/api/admissions', require('./routes/admissions'));
app.use('/api/studentCouncil', require('./routes/studentCouncil'));

// MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB error:', err));

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
