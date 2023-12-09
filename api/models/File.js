const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  download: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("files", FileSchema);
