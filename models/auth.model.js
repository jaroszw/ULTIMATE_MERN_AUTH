const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowecase: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 'Normal',
    },
    resetPasswordLink: {
      data: String,
      default: '',
    },
  },
  { timeStamp: true }
);

userSchema
  .virtual('password')
  .set(function (password) {
    this.password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  makeSalt: function () {
    return Math.random(new Date().valueOf() * Math.random()) + '';
  },
  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto.createHmac('sh1', this.salt).update(password).digest('hex');
    } catch (error) {
      return '';
    }
  },
  authenticate: function (plainPassword) {
    return this.encryptPassword(plainPassword) === this.hashed_password;
  },
};

module.exports = mongoose.model('User', userSchema);
