var dbURI = 'mongodb://localhost:27017/pomodoroTest';
var clearDB = require('mocha-mongoose')(dbURI);

var mongoose = require('mongoose');

var expect = require('chai').expect;

var supertest = require('supertest');

require('../../../server/db/models');

var User = mongoose.model('User');

var app = require('../../../server/app');

describe('Inbox API:', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('Newly created user', function () {

		var loggedInAgent;

		var userInfo = {
			firstName: 'Red',
			lastName: 'Tomato',
			email: 'user@pomodoro.com',
			password: 'tomato'
		};

		var userId, inboxId;

		beforeEach('Create the user', function (done) {
			User.create(userInfo)
				.then(function (newUser) {
					userId = newUser._id;
					inboxId = newUser.inbox[0];
					done();
				}, done);
		});

		beforeEach('Create loggedIn user agent and authenticate', function (done) {
			loggedInAgent = supertest.agent(app);
			loggedInAgent.post('/login').send(userInfo).end(done);
		});

		it('should have the default inbox set up', function (done) {
			loggedInAgent.get('/api/users/' + userId + '/inbox/' + inboxId)
				.expect(200)
				.end(function (err, res) {
					if (err) return done(err);
					expect(res.body.title).to.equal('My Inbox');
					done();
				});
		});

		it('should be able to change inbox title', function (done) {
			loggedInAgent.put('/api/users/' + userId + '/inbox/' + inboxId)
				.send({ title: 'Work' })
				.expect(200)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body.title).to.equal('Work');
					done();
				});
		});

		it('should be able to create a new inbox', function (done) {
			loggedInAgent.post('/api/users/' + userId + '/inbox')
				.send({ title: 'Work' })
				.expect(200)
				.end(function (err, res) {
					if(err) return done(err);
					expect(res.body.title).to.equal('Work');
					done();
				});
		});

		it('should get 200 response with all of the inboxes', function (done) {
			loggedInAgent.post('/api/users/' + userId + '/inbox')
				.send({ title: 'Work' })
				.expect(200)
				.end(function (err) {
					if(err) return done(err);
					loggedInAgent.get('/api/users/' + userId + '/inbox')
						.expect(200)
						.end(function (getErr, getRes) {
							if (getErr) return done(getErr);
							expect(getRes.body[0].title).to.equal('My Inbox');
							expect(getRes.body[1].title).to.equal('Work');
							done();
						});
				});
		});


	});

});
