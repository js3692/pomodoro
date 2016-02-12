'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    default: 'normal',
    enum: ['low', 'normal', 'high']
  },
  notes: {
    type: String
  },
  due: {
    type: Date
  },
  lastModified: {
    type: Date
  },
  inbox: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Inbox'
  }
});

schema.pre('save', function (next) {
  this.lastModified = new Date();
  next();
});

mongoose.model('Task', schema);