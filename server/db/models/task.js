'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  due: {
    type: Date
  },
  lastModified: {
    type: Date
  },
  notes: {
    type: String
  },
  priority: {
    enum: ['low', 'normal', 'high']
  },
  inbox: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inbox'
  }
});

schema.pre('save', function () {
  this.lastModified = new Date();
});

mongoose.model('Task', schema);