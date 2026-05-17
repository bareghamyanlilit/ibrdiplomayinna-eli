const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Admin-i schema — anun, email (unique), gaxtnabary
const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Naxqan save-ic avtomatoren hash-enq gaxtnabary (tolk ev ethe poxvel e)
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Metos gaxtnabary verificelu hamar (anel e hash-i hamarkarcum)
adminSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
