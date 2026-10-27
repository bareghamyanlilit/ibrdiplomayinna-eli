
const router = require('express').Router();

const Department = require('../models/Department');
const auth = require('../middleware/auth');

// Պահպանում է հին արժեքը, եթե դաշտը հարցման մեջ չկա։
function field(body, key, previous = '') {
    return body[key] !== undefined ? body[key] : previous;
}

// Աջակցում է infoParts-ի թե՛ JSON string, թե՛ object տարբերակներին։
function parseInfoParts(value, previous = { title: { am: '' }, info: [] }) {
    if (value === undefined) return previous;

    if (typeof value === 'string') {
        return JSON.parse(value);
    }

    return value;
}

// Նկարների URL-ների մշակում։
function parseImages(value, previous = []) {
    if (value === undefined) return previous;

    const values = Array.isArray(value) ? value : [value];

    return values.filter(
        (url) => typeof url === 'string' && url.trim()
    ).map((url) => url.trim());
}

// Boolean արժեքների մշակում։
function parseBoolean(value, previous = false) {
    if (value === undefined) return previous;
    if (typeof value === 'boolean') return value;
    return value !== 'false';
}

// ==================== GET PUBLISHED ====================

router.get('/', async (req, res) => {
    try {
        const items = await Department.find({ isPublished: true })
            .sort({ order: 1, createdAt: 1 });

        return res.json(items);
    } catch (err) {
        console.error('GET DEPARTMENTS ERROR:', err);
        return res.status(500).json({
            message: 'Failed to load departments',
        });
    }
});

// ==================== GET ALL FOR ADMIN ====================

router.get('/admin', auth, async (req, res) => {
    try {
        const items = await Department.find()
            .sort({ order: 1, createdAt: 1 });

        return res.json(items);
    } catch (err) {
        console.error('GET ADMIN DEPARTMENTS ERROR:', err);
        return res.status(500).json({
            message: 'Failed to load departments',
        });
    }
});

// ==================== GET ONE ====================

router.get('/:id', async (req, res) => {
    try {
        const item = await Department.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                message: 'Department not found',
            });
        }

        return res.json(item);
    } catch (err) {
        console.error('GET DEPARTMENT ERROR:', err);
        return res.status(500).json({
            message: 'Failed to load department',
        });
    }
});

// ==================== CREATE ====================

router.post('/', auth, async (req, res) => {
    try {
        const b = req.body || {};

        let infoParts;

        try {
            infoParts = parseInfoParts(b.infoParts);
        } catch {
            return res.status(400).json({
                message: 'Invalid infoParts JSON',
            });
        }

        const dept = await Department.create({
            color: b.color || '#004471',

            title: {
                am: b.titleAm || '',
                ru: b.titleRu || '',
                en: b.titleEn || '',
            },

            descr: {
                am: b.descrAm || '',
                ru: b.descrRu || '',
                en: b.descrEn || '',
            },

            shortTitle: {
                am: b.shortTitleAm || '',
                ru: b.shortTitleRu || '',
                en: b.shortTitleEn || '',
            },

            // Այս արժեքներն արդեն Cloudinary URL-ներ են։
            video: b.videoUrl || '',
            childImg: b.childImgUrl || '',

            // Frontend-ն ուղարկում է արդեն վերբեռնված նկարների URL-ները։
            images: parseImages(b.existingImages, []),

            infoParts,

            partImgTitle: {
                am: b.partImgTitleAm || '',
                ru: b.partImgTitleRu || '',
                en: b.partImgTitleEn || '',
            },

            order: Number(b.order) || 0,
            isPublished: parseBoolean(b.isPublished, true),
        });

        return res.status(201).json(dept);
    } catch (err) {
        console.error('CREATE DEPARTMENT ERROR:', err);

        return res.status(500).json({
            message: err.message || 'Failed to create department',
        });
    }
});

// ==================== UPDATE ====================

router.put('/:id', auth, async (req, res) => {
    try {
        const b = req.body || {};

        const existing = await Department.findById(req.params.id);

        if (!existing) {
            return res.status(404).json({
                message: 'Department not found',
            });
        }

        let infoParts;

        try {
            infoParts = parseInfoParts(b.infoParts, existing.infoParts);
        } catch {
            return res.status(400).json({
                message: 'Invalid infoParts JSON',
            });
        }

        const update = {
            color: field(b, 'color', existing.color || '#004471'),

            title: {
                am: field(b, 'titleAm', existing.title?.am || ''),
                ru: field(b, 'titleRu', existing.title?.ru || ''),
                en: field(b, 'titleEn', existing.title?.en || ''),
            },

            descr: {
                am: field(b, 'descrAm', existing.descr?.am || ''),
                ru: field(b, 'descrRu', existing.descr?.ru || ''),
                en: field(b, 'descrEn', existing.descr?.en || ''),
            },

            shortTitle: {
                am: field(b, 'shortTitleAm', existing.shortTitle?.am || ''),
                ru: field(b, 'shortTitleRu', existing.shortTitle?.ru || ''),
                en: field(b, 'shortTitleEn', existing.shortTitle?.en || ''),
            },

            video: field(b, 'videoUrl', existing.video || ''),
            childImg: field(b, 'childImgUrl', existing.childImg || ''),

            images: parseImages(b.existingImages, existing.images || []),

            infoParts,

            partImgTitle: {
                am: field(b, 'partImgTitleAm', existing.partImgTitle?.am || ''),
                ru: field(b, 'partImgTitleRu', existing.partImgTitle?.ru || ''),
                en: field(b, 'partImgTitleEn', existing.partImgTitle?.en || ''),
            },

            order: b.order !== undefined
                ? Number(b.order) || 0
                : existing.order || 0,

            isPublished: parseBoolean(b.isPublished, existing.isPublished),
        };

        const dept = await Department.findByIdAndUpdate(
            req.params.id,
            update,
            {
                new: true,
                runValidators: true,
            }
        );

        return res.json(dept);
    } catch (err) {
        console.error('UPDATE DEPARTMENT ERROR:', err);

        return res.status(500).json({
            message: err.message || 'Failed to update department',
        });
    }
});

// ==================== DELETE ====================

router.delete('/:id', auth, async (req, res) => {
    try {
        const dept = await Department.findByIdAndDelete(req.params.id);

        if (!dept) {
            return res.status(404).json({
                message: 'Department not found',
            });
        }

        return res.json({ message: 'Deleted' });
    } catch (err) {
        console.error('DELETE DEPARTMENT ERROR:', err);

        return res.status(500).json({
            message: 'Failed to delete department',
        });
    }
});

module.exports = router;
