const mongoose = require('mongoose');

// Gradrani fayli schema — canunayin anun, masnagitvutyun, fayli anun ev erth,
// haychut, MIME type, dashavoracum, hryatarakutyun
const libraryFileSchema = new mongoose.Schema({
  name: {
    am: { type: String, default: '' },
    ru: { type: String, default: '' },
    en: { type: String, default: '' },
  }, // Multilingual display name
  specialty: {
    am: { type: String, default: '' },
    ru: { type: String, default: '' },
    en: { type: String, default: '' },
  }, // Multilingual specialty name
  fileName: { type: String, required: true }, // original filename
  filePath: { type: String, required: true }, // server path /uploads/...
  fileSize: { type: Number, default: 0 },
  mimeType: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('LibraryFile', libraryFileSchema);