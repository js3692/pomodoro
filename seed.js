var Promise = require('bluebird');
var chalk = require('chalk');

var mongoose = require('mongoose');
var connectToDb = require('./server/db');

var User = Promise.promisifyAll(mongoose.model('User'));
var Inbox = Promise.promisifyAll(mongoose.model('Inbox'));
var Task = Promise.promisifyAll(mongoose.model('Task'));

var seedInboxes = function () {

	var inboxes = [
		{
			// Default inbox
		},
		{
			title: 'My Project'
		},
		{
			// Default inbox
		},
		{
			title: 'My Project'
		}
	];

	return Inbox.createAsync(inboxes);
}

var tasks = [
	{
		title: "Find apartment",
		priority: "low",
		notes: "Use craigslist",
		due: new Date(2016, 1, 15),
	},
	{
		title: "Look up flights",
		notes: "NYC to London",
		due: new Date(2016, 1, 16),
	},
	{
		title: "Get hired",
		priority: "high",
		notes: "Solve some pymetrics problems",
		due: new Date(2016, 1, 17),
	},
	{
		title: "Learn Ruby",
		notes: "Maybe read about Rails too",
		due: new Date(2016, 1, 18),
	},
	{
		title: "Learn React",
		priority: "high",
		notes: "React is cool",
		due: new Date(2016, 1, 19),
	}
];

var users = [
  {
  	firstName: 'Red',
  	lastName: 'Tomato',
    email: 'red@pomodoro.com',
    password: 'password'
  },
  {
  	firstName: 'Green',
  	lastName: 'Tomato',
    email: 'green@pomodoro.com',
    password: 'password'
  }
];

var inboxIds;
connectToDb.then(function (db) {
  return db.db.dropDatabase();
})
.then(function () {
  console.log(chalk.magenta('Database dropped'));
  return seedInboxes();
})
.then (function (createdInboxes) {
  console.log(chalk.grey('Inboxes created'));
	inboxIds = createdInboxes.map(inbox => {
		return inbox._id;
	});
	tasks.forEach((task, idx) => {
		if(idx < 3) task.inbox = inboxIds[0];
		else task.inbox = inboxIds[1];
	})
  return Task.createAsync(tasks);
})
.then (function () {
  console.log(chalk.grey('Red\'s Tasks created'));
	tasks.forEach((task, idx) => {
		if(idx < 3) task.inbox = inboxIds[2];
		else task.inbox = inboxIds[3];
	})
  return Task.createAsync(tasks);
})
.then (function () {
  console.log(chalk.grey('Green\'s tasks created'));
  users[0].inbox = [mongoose.Types.ObjectId(inboxIds[0]), mongoose.Types.ObjectId(inboxIds[1])];
  users[1].inbox = [mongoose.Types.ObjectId(inboxIds[2]), mongoose.Types.ObjectId(inboxIds[3])];
  return User.createAsync(users);
})
.then(function () {
  console.log(chalk.grey('Users created'));
  console.log(chalk.blue('Seed successful!'));
  process.kill(0);
})
.catch(function (err) {
  console.error(err);
  process.kill(1);
});