const mongoose = require('mongoose');

// Gradrani fayli schema — canunayin anun, masnagitvutyun, fayli anun ev erth,
// haychut, MIME type, dashavoracum, hryatarakutyun
const libraryFileSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Display name of the file
  specialty: { type: String, required: true }, // Which specialty it belongs to
  fileName: { type: String, required: true }, // original filename
  filePath: { type: String, required: true }, // server path /uploads/...
  fileSize: { type: Number, default: 0 },
  mimeType: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('LibraryFile', libraryFileSchema);
