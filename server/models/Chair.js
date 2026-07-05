const mongoose = require('mongoose');

// Ambioni schema — anvanacum (am/ru/en), bnuthagrutyan (am/ru/en),
// nkar, nakhagah (anun, nkaragrutyan, lus),
// anjnakazicci ankerner (texteric), dashavoracmany
const chairSchema = new mongoose.Schema({
  title: { am: { type: String, required: true }, ru: { type: String, default: '' }, en: { type: String, default: '' } },
  descr: { am: { type: String, default: '' }, ru: { type: String, default: '' }, en: { type: String, default: '' } },
  img: { type: String, default: '' },
  boss: {
    name: { type: String, default: '' },
    descr: { type: String, default: '' },
    src: { type: String, default: '' },
  },
  staff: [{ type: String }],
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Chair', chairSchema);
