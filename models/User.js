const { Schema, model } = require('mongoose');

const User = new Schema({
  username: { type: String, unique: true, required: true },
  createdDate: { type: Date },
});

module.exports = model('User', User);
