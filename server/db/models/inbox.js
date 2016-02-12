'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  title: {
    type: String,
    default: "My Inbox"
  },
  created: {
    type: Date,
    default: new Date()
  }
});

mongoose.model('Inbox', schema);