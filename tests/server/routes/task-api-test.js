var dbURI = 'mongodb://localhost:27017/pomodoroTest';
var clearDB = require('mocha-mongoose')(dbURI);

var mongoose = require('mongoose');

var expect = require('chai').expect;

var supertest = require('supertest');

require('../../../server/db/models');

var User = mongoose.model('User');

var app = require('../../../server/app');

describe('Task API:', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	after('Clear test database', function (done) {
		clearDB(done);
	});

	describe('A pomodoro user', function () {

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

		it('should be able to create a task', function (done) {
			loggedInAgent.post('/api/users/' + userId + '/inbox/' + inboxId + '/tasks')
				.send({
					title: "Get milk",
					notes: "My very first pomodoro task!"
				})
				.expect(200)
				.end(function (err, res) {
					if (err) return done(err);
					expect(res.body.inbox.title).to.equal('My Inbox');
					done();
				});
		});

		it('should be able to get all tasks in an inbox', function (done) {
			loggedInAgent.post('/api/users/' + userId + '/inbox/' + inboxId + '/tasks')
				.send({
					title: "Get milk",
					notes: "My very first pomodoro task!"
				})
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					loggedInAgent.post('/api/users/' + userId + '/inbox/' + inboxId + '/tasks')
						.send({
							title: "Get juice",
							notes: "My second pomodoro task!"
						})
						.expect(200)
						.end(function (secondErr) {
							if (secondErr) return done(secondErr);
							loggedInAgent.post('/api/users/' + userId + '/inbox/' + inboxId + '/tasks')
								.send({
									title: "Get water",
									notes: "My third pomodoro task!"
								})
								.expect(200)
								.end(function (thirdErr) {
									if (thirdErr) return done(thirdErr);
									loggedInAgent.get('/api/users/' + userId + '/inbox/' + inboxId + '/tasks')
										.expect(200)
										.end(function (fourthErr, res) {
											if (fourthErr) return done(fourthErr);
											expect(res.body.length).to.equal(3);
											expect(res.body[0].title).to.equal('Get milk');
											expect(res.body[1].title).to.equal('Get juice');
											expect(res.body[2].title).to.equal('Get water');
											done();
										});
								});
						});
				});
		});

		it('should be able to fetch a single task', function (done) {
			var taskId;
			loggedInAgent.post('/api/users/' + userId + '/inbox/' + inboxId + '/tasks')
				.send({
					title: "Get milk",
					notes: "My very first pomodoro task!"
				})
				.expect(200)
				.end(function (err, firstRes) {
					if(err) return done(err);
					taskId = firstRes.body._id;
					loggedInAgent.get('/api/users/' + userId + '/inbox/' + inboxId + '/tasks/' + taskId)
						.expect(200)
						.end(function (secondErr, secondRes) {
							if (secondErr) return done(secondErr);
							expect(secondRes.body.title).to.equal('Get milk');
							done();
						});
				});
		});

		it('should be able to change a task detail', function (done) {
			var taskId;
			loggedInAgent.post('/api/users/' + userId + '/inbox/' + inboxId + '/tasks')
				.send({
					title: "Get milk",
					notes: "My very first pomodoro task!"
				})
				.expect(200)
				.end(function (err, firstRes) {
					if(err) return done(err);
					taskId = firstRes.body._id;
					loggedInAgent.put('/api/users/' + userId + '/inbox/' + inboxId + '/tasks/' + taskId)
						.send({
							title: "Get juice actually"
						})
						.expect(200)
						.end(function (secondErr) {
							if(secondErr) return done(secondErr);
							loggedInAgent.get('/api/users/' + userId + '/inbox/' + inboxId + '/tasks')
								.expect(200)
								.end(function (thirdErr, secondRes) {
									if (thirdErr) return done(thirdErr);
									expect(secondRes.body[0].title).to.equal('Get juice actually');
									done();
								});
						});
				});
		});

	});

});
