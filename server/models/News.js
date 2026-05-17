const mongoose = require('mongoose');

// Norutyunneri (graruumneri) schema — vercnagir, bovan (am/ru/en),
// video, pastatvjker, hryatarakutyun
const newsSchema = new mongoose.Schema(
  {
    title: {
      am: { type: String, required: true },
      ru: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    content: {
      am: { type: String, required: true },
      ru: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    video: { type: String, default: '' },
    images: [{ type: String }],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('News', newsSchema);
