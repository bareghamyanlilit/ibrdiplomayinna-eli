
const router = require('express').Router();
const LibraryFile = require('../models/LibraryFile');
const auth = require('../middleware/auth');

// GET / — հրապարակված ֆայլեր
router.get('/', async (req, res) => {
    try {
        const { specialty, search } = req.query;
        const query = { isPublished: true };

        if (specialty) query['specialty.am'] = specialty;
        if (search) query['name.am'] = { $regex: search, $options: 'i' };

        const items = await LibraryFile.find(query).sort({
            'specialty.am': 1,
            order: 1,
        });

        res.json(items);
    } catch (err) {
        console.error('GET LIBRARY ERROR:', err);
        res.status(500).json({ message: err.message });
    }
});

// GET /specialties — մասնագիտությունների ցանկ
router.get('/specialties', async (req, res) => {
    try {
        const items = await LibraryFile.find(
            { isPublished: true },
            { specialty: 1 }
        );

        const seen = new Set();
        const specialties = [];

        for (const item of items) {
            const key = item.specialty?.am || '';

            if (key && !seen.has(key)) {
                seen.add(key);
                specialties.push(item.specialty);
            }
        }

        specialties.sort((a, b) =>
            (a.am || '').localeCompare(b.am || '')
        );

        res.json(specialties);
    } catch (err) {
        console.error('GET LIBRARY SPECIALTIES ERROR:', err);
        res.status(500).json({ message: err.message });
    }
});

// GET /admin — բոլոր ֆայլերը ադմինի համար
router.get('/admin', auth, async (req, res) => {
    try {
        const items = await LibraryFile.find().sort({
            'specialty.am': 1,
            order: 1,
        });

        res.json(items);
    } catch (err) {
        console.error('GET LIBRARY ADMIN ERROR:', err);
        res.status(500).json({ message: err.message });
    }
});

// POST / — նոր ֆայլի տվյալները պահել MongoDB-ում
// Ֆայլն արդեն պետք է վերբեռնված լինի Cloudinary
router.post('/', auth, async (req, res) => {
    try {
        const {
            nameAm,
            nameRu,
            nameEn,
            specialtyAm,
            specialtyRu,
            specialtyEn,
            order,
            fileUrl,
            fileName,
            fileSize,
            mimeType,
        } = req.body;

        if (!fileUrl || !/^https:\/\/res\.cloudinary\.com\//.test(fileUrl)) {
            return res.status(400).json({
                message: 'Cloudinary ֆայլի URL-ը բացակայում է կամ անվավեր է',
            });
        }

        const fallbackName = nameAm || fileName || 'Ֆայլ';

        const item = await LibraryFile.create({
            name: {
                am: nameAm || fallbackName,
                ru: nameRu || fallbackName,
                en: nameEn || fallbackName,
            },
            specialty: {
                am: specialtyAm || '',
                ru: specialtyRu || specialtyAm || '',
                en: specialtyEn || specialtyAm || '',
            },
            fileName: fileName || fallbackName,
            filePath: fileUrl,
            fileSize: Number(fileSize) || 0,
            mimeType: mimeType || 'application/octet-stream',
            order: Number(order) || 0,
        });

        res.status(201).json(item);
    } catch (err) {
        console.error('CREATE LIBRARY FILE ERROR:', err);
        res.status(500).json({ message: err.message });
    }
});

// PUT /:id — թարմացնել ֆայլի տվյալները
router.put('/:id', auth, async (req, res) => {
    try {
        const existing = await LibraryFile.findById(req.params.id);

        if (!existing) {
            return res.status(404).json({ message: 'Ֆայլը չի գտնվել' });
        }

        const {
            nameAm,
            nameRu,
            nameEn,
            specialtyAm,
            specialtyRu,
            specialtyEn,
            order,
            isPublished,
            fileUrl,
            fileName,
            fileSize,
            mimeType,
        } = req.body;

        if (
            fileUrl !== undefined &&
            !/^https:\/\/res\.cloudinary\.com\//.test(fileUrl)
        ) {
            return res.status(400).json({
                message: 'Cloudinary ֆայլի URL-ն անվավեր է',
            });
        }

        const update = {
            name: {
                am: nameAm ?? existing.name?.am ?? '',
                ru: nameRu ?? existing.name?.ru ?? '',
                en: nameEn ?? existing.name?.en ?? '',
            },
            specialty: {
                am: specialtyAm ?? existing.specialty?.am ?? '',
                ru: specialtyRu ?? existing.specialty?.ru ?? '',
                en: specialtyEn ?? existing.specialty?.en ?? '',
            },
            order:
                order !== undefined
                    ? Number(order) || 0
                    : existing.order || 0,
            isPublished:
                isPublished === undefined
                    ? existing.isPublished
                    : isPublished !== false && isPublished !== 'false',
        };

        // Նոր ֆայլ է վերբեռնվել՝ թարմացնել ֆայլի տվյալները
        if (fileUrl) {
            update.filePath = fileUrl;
            update.fileName = fileName || existing.fileName;
            update.fileSize = Number(fileSize) || 0;
            update.mimeType =
                mimeType || 'application/octet-stream';
        }

        const item = await LibraryFile.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, runValidators: true }
        );

        res.json(item);
    } catch (err) {
        console.error('UPDATE LIBRARY FILE ERROR:', err);
        res.status(500).json({ message: err.message });
    }
});

// DELETE /:id — հեռացնել ֆայլի գրառումը MongoDB-ից
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await LibraryFile.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Ֆայլը չի գտնվել' });
        }

        // Cloudinary-ի ֆայլը մնում է Cloudinary-ում։
        // Այն ջնջելու համար անհրաժեշտ է առանձին Cloudinary destroy գործողություն։
        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error('DELETE LIBRARY FILE ERROR:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
