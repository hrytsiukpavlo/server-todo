const { Schema, model } = require('mongoose');

const Note = new Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = model('Note', Note);
