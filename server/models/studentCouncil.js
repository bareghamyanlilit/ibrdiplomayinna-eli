const mongoose = require("mongoose");

const studentCouncilSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    descr: {
      type: String,
      default: "",
    },
    src: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      enum: [
        "Ուսանողական խորհրդի նախագահ",
        "Ուսանողական խորհրդի փոխնախագահ",
        "Ուսանողական խորհրդի քարտուղար",
      ],
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("studentCouncil", studentCouncilSchema);