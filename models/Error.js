const { Schema, model } = require('mongoose');

const Error = new Schema({
  message: { type: String },
});

module.exports = model('Error', Error);
