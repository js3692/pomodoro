var dbURI = 'mongodb://localhost:27017/pomodoroTest';
var clearDB = require('mocha-mongoose')(dbURI);

var mongoose = require('mongoose');

var expect = require('chai').expect;

require('../../../server/db/models');

var Task = mongoose.model('Task');

describe('Task model:', function () {

  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });

  it('should exist', function () {
    expect(Task).to.be.a('function');
  });

  describe('Basic operations ==>', function () {
    
  });

});