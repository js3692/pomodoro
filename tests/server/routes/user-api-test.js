var dbURI = 'mongodb://localhost:27017/pomodoroTest';
var clearDB = require('mocha-mongoose')(dbURI);

var mongoose = require('mongoose');

var expect = require('chai').expect;

var supertest = require('supertest');

require('../../../server/db/models');

var User = mongoose.model('User');

var app = require('../../../server/app');

describe('User API:', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('Unauthenticated request', function () {

		var guestAgent;

		beforeEach('Create guest agent', function () {
			guestAgent = supertest.agent(app);
		});

		var userInfo = {
			email: 'red@pomodoro.com',
			password: 'tomato'
		};
		var userId;

		beforeEach('Create a user', function (done) {
			User.create(userInfo)
				.then(function (newUser) {
					userId = newUser._id;
					done();
				}, done);
		});

		it('should get a 401 response even with a valid userId', function (done) {
			guestAgent.get('/api/users/' + userId)
				.expect(401)
				.end(done);
		});

		it('should be able to sign up', function (done) {
			guestAgent.post('/api/users/')
				.send({
					first: "Green",
					last: "Tomato",
					email: "green@pomodoro.com",
					password: "tomato"
				})
				.expect(200)
				.end(done);
		});
	});

	describe('Authenticated request', function () {

		var loggedInAgent;

		var userInfo = {
			firstName: 'Red',
			lastName: 'Tomato',
			email: 'user@pomodoro.com',
			password: 'tomato'
		};

		var otherUserInfo = {
			email: 'oblivious@pomodoro.com',
			password: 'tomato'
		}

		var userId, otherUserId;
		beforeEach('Create the users', function (done) {
			User.create(userInfo)
				.then(function (newUser) {
					userId = newUser._id;
					return User.create(otherUserInfo);
				})
				.then(function (otherNewUser) {
					otherUserId = otherNewUser._id;
					done();
				}, done);
		});

		beforeEach('Create loggedIn user agent and authenticate', function (done) {
			loggedInAgent = supertest.agent(app);
			loggedInAgent.post('/login').send(userInfo).end(done);
		});

		it('should get 200 response and user data should be updated', function (done) {
			loggedInAgent.put('/api/users/' + userId)
				.send({ firstName: 'Green' })
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					User.findById(userId)
						.then(function (updatedUser) {
							expect(updatedUser.firstName).to.equal('Green');
							done();
						})
						.catch(done);
				});
		});

		it('should not be able to update another user', function (done) {
			loggedInAgent.put('/api/users/' + otherUserId)
				.expect(403)
				.end(function (err) {
					if (err) return done(err);
					done();
				});
		});

	});

});
