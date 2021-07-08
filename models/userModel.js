const mongoose = require('mongoose');
const validator = require('validator');

// name, email, photo, password, confirm password
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please tell your name'],
    unique: true,
  },
  email: {
    type: String,
    require: [true, 'Please provided your email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide valid email'],
    lowerCase: true,
  },
  photo: String,
  password: {
    type: String,
    require: [true, 'Please provide yours password'],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same',
    },
  },
});

const User = mongoose.model('User', tourSchema);
module.exports = User;
