'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');

var Inbox = mongoose.model('Inbox');

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
  },
  inbox: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inbox'
  }]
});

var generateSalt = function () {
  return crypto.randomBytes(16).toString('base64');
};

schema.statics.generateSalt = generateSalt;

var encryptPassword = function (plainText, salt) {
  var hash = crypto.createHash('sha256');
  hash.update(plainText);
  hash.update(salt);
  return hash.digest('hex');
};

schema.statics.encryptPassword = encryptPassword;

schema.pre('validate', function (next) {
  var self = this;
  if(this.inbox.length === 0) {
    Inbox.create({})
      .then(function (newInbox) {
        self.inbox.push(mongoose.Types.ObjectId(newInbox._id));
        next();
      })
      .catch(next);
  } else next();
})

schema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.salt = this.constructor.generateSalt();
    this.password = this.constructor.encryptPassword(this.password, this.salt);
  }
  next();
});

schema.methods.sanitize = function () {
  return _.omit(this.toJSON(), ['password', 'salt', 'google']);
};

schema.methods.correctPassword = function (candidatePassword) {
  return encryptPassword(candidatePassword, this.salt) === this.password;
};

mongoose.model('User', schema);