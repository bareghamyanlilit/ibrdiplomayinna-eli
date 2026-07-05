const mongoose = require('mongoose');

// Dimordneri aghjusaki mi tol — masnagitvutyun, himk, vorkavarum, ararkanner, zhamkek
// Ashxatum e am ev ru ev en lezvov
// type dastak e՝ full (acarakan) kkkam remote (hhavakan)
const admissionRowSchema = new mongoose.Schema({
  specialty: { am: String, ru: { type: String, default: '' }, en: { type: String, default: '' } },
  educationBase: { am: String, ru: { type: String, default: '' }, en: { type: String, default: '' } },
  qualification: { am: String, ru: { type: String, default: '' }, en: { type: String, default: '' } },
  subjects: { am: String, ru: { type: String, default: '' }, en: { type: String, default: '' } },
  duration: { am: String, ru: { type: String, default: '' }, en: { type: String, default: '' } },
  type: { type: String, enum: ['full', 'remote'], default: 'full' }, // full-time or remote
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('AdmissionRow', admissionRowSchema);
