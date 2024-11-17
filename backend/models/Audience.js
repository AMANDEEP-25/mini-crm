const mongoose = require("mongoose");

const audienceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  conditions: [
    {
      field: { type: String, required: true },
      operator: { type: String, required: true },
      value: { type: mongoose.Schema.Types.Mixed, required: true },
    },
  ],
  logic: { type: String, required: true, enum: ["AND", "OR"] },
  size: { type: Number, required: true },
});

module.exports = mongoose.model("Audience", audienceSchema);
