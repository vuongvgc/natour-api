const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// name, email, photo, password, confirm password
const userSchema = new mongoose.Schema({
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

userSchema.pre('save', async function (next) {
  // Only run function when password actual modify
  if (!this.isModified('password')) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 16);
  // Delete passwordConfirm Fields
  this.passwordConfirm = undefined;
});

const User = mongoose.model('User', userSchema);
module.exports = User;
