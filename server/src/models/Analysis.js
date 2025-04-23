const mongoose = require("mongoose");

const AnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      enum: ["meningioma", "glioma", "pituitary", "no_tumor"],
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    class_probabilities: {
      type: Map,
      of: Number,
      default: {},
    },
    status: {
      type: String,
      enum: ["success", "warning", "error", "processing"],
      default: "success",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Analysis", AnalysisSchema);
