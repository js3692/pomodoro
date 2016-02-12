'use strict';

var router = require('express').Router();

var mongoose = require('mongoose');
var Task = mongoose.model('Task');

// CURRENT REQ PATH: /api/users/:userId/inbox/:inboxId/tasks

router.get('/', function (req, res, next) {
	Task.find({ inbox: req.inbox._id }).populate('inbox')
		.then(function (foundTasks) {
			res.json(foundTasks);
		})
		.catch(next);
})

router.post('/', function (req, res, next) {
	if(!req.body.inbox) req.body.inbox = req.inbox._id;
	Task.create(req.body)
		.then(function (newTask) {
			return Task.findById(newTask._id).populate('inbox');
		})
		.then(function (newTaskPopulated) {
			res.json(newTaskPopulated);
		})
		.catch(next);
});

router.get('/:taskId', function (req, res, next) {
	Task.findById(req.params.taskId)
		.then(function (foundTask) {
			res.json(foundTask);
		})
		.catch(next);
});

router.put('/:taskId', function (req, res, next) {
	Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true })
		.then(function (updatedTask) {
			// Following will be an array for some reason..
			res.json(updatedTask);
		})
		.catch(next);
});

module.exports = router;