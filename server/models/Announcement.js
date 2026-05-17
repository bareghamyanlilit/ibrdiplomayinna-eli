const mongoose = require('mongoose');

// Haytararutyunneri schema — vercnagir, bovan (am/ru/en), video, pastatvjker
// upToDate — vercin ariakarutyyan ampajy
// isPublished — karenq zheshtut darjnel cherchagrvy hamar
const announcementSchema = new mongoose.Schema(
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
    upToDate: { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);
