'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  title: {
    type: String,
    default: "My Inbox"
  },
  created: {
    type: Date
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

schema.pre('save', function () {
  if(!this.created) this.created = new Date();
});

mongoose.model('Inbox', schema);