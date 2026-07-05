const mongoose = require('mongoose');

// Tvin schema — nkar, vercnagir, nkaragrutyan masner (am/ru/en)
const infoPartSchema = new mongoose.Schema({
  img: { type: String, default: '' },
  title: { am: String, ru: { type: String, default: '' }, en: { type: String, default: '' } },
  desc: { am: String, ru: { type: String, default: '' }, en: { type: String, default: '' } },
});

// Masnagitvutyunneri (acharakcutyan) schema:
// grvetashxaghakan guyner, vercnagrer, nkaragrutyunner, video, nkarer,
// tviner (infoParts) ev nkarneri vercnagir (partImgTitle)
const departmentSchema = new mongoose.Schema({
  color: { type: String, default: '#004471' },
  title: { am: { type: String, required: true }, ru: { type: String, default: '' }, en: { type: String, default: '' } },
  descr: { am: { type: String, default: '' }, ru: { type: String, default: '' }, en: { type: String, default: '' } },
  shortTitle: { am: String, ru: { type: String, default: '' }, en: { type: String, default: '' } },
  video: { type: String, default: '' },
  childImg: { type: String, default: '' },
  linkTxt: { am: { type: String, default: 'Ավելին' }, ru: { type: String, default: 'Подробнее' }, en: { type: String, default: 'More' } },
  infoParts: {
    title: { am: String, ru: { type: String, default: '' }, en: { type: String, default: '' } },
    info: [infoPartSchema],
  },
  images: [{ type: String }],
  partImgTitle: { am: { type: String, default: '' }, ru: { type: String, default: '' }, en: { type: String, default: '' } },
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
