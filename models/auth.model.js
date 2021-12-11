const mongoose = require('mongoose');
const crypto = require('crypto');

// user schema
const userScheama = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: [true, 'Email is required - custom message'],
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required - custom message'],
    },
    hashed_password: {
      type: String,
      required: [true, 'Password is required - custom message'],
    },
    salt: String,
    role: {
      type: String,
      default: 'subscriber',
    },
    resetPasswordLink: {
      data: String,
      default: '',
    },
    testValue: String,
  },
  {
    timestamps: true,
  }
);

// virtual
userScheama
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this.password;
  });

// methods
userScheama.methods = {
  authenticate: async function (plainText) {
    return this.encryptPassword(plainText.toString()) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },

  resetPassword: async function (password) {
    this._password = password;
    this.resetPasswordLink = '';
    this.hashed_password = this.encryptPassword(password.toString());
    return this.encryptPassword(password.toString()) === this.hashed_password;
  },
};

module.exports = mongoose.model('User', userScheama);
