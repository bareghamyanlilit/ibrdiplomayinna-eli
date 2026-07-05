const mongoose = require('mongoose');

// Anjnakazci schema — anun, nkaragrutyun, lusankar,
// category (boss / educationalAid / serviceStaff), dashavoracum
const staffMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  descr: { type: String, default: '' },
  src: { type: String, default: '' },
  category: { type: String, enum: ['boss', 'educationalAid', 'serviceStaff'], required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('StaffMember', staffMemberSchema);
