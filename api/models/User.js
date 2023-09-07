const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    requred: true,
  },
  password: {
    type: String,
    requred: true,
  },
  roles: {
    type: [String],
    default: ['Employee'],
    requred: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('User', userSchema);
