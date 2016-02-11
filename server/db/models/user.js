'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String
  },
  google: {
    id: String
  }
});

schema.methods.sanitize = function () {
  return _.omit(this.toJSON(), ['password', 'salt', 'google']);
};

var generateSalt = function () {
  return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
  var hash = crypto.createHash('sha256');
  hash.update(plainText);
  hash.update(salt);
  return hash.digest('hex');
};

schema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.salt = this.constructor.generateSalt();
    this.password = this.constructor.encryptPassword(this.password, this.salt);
  }

  next();
});

schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;

schema.method('correctPassword', function (candidatePassword) {
  return encryptPassword(candidatePassword, this.salt) === this.password;
});

mongoose.model('User', schema);