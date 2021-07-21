const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// name, email, photo, password, confirm password
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please tell your name'],
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
    select: false,
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
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  // Only run function when password actual modify
  if (!this.isModified('password')) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm Fields
  this.passwordConfirm = undefined;
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  password
) {
  return await bcrypt.compare(candidatePassword, password);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(JWTTimestamp < changeTimestamp);
    return JWTTimestamp < changeTimestamp;
  }
  return false;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
