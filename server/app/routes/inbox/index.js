'use strict';

var router = require('express').Router();

var mongoose = require('mongoose');
var Inbox = mongoose.model('Inbox');

// CURRENT REQ PATH: /api/users/:userId/inbox

router.get('/', function (req, res, next) {
	Inbox.find({ _id: { $in: req.user.inbox } })
		.then(function (inboxes) {
			res.json(inboxes);
		})
		.catch(next);
})

router.post('/', function (req, res, next) {
	var inboxToSend;
	Inbox.create(req.body)
		.then(function (newInbox) {
			inboxToSend = newInbox;
			req.user.inbox.push(newInbox._id);
			return req.user.save();
		})
		.then(function () {
			res.json(inboxToSend);
		})
		.catch(next);
});

router.param('inboxId', function (req, res, next, inboxId) {
	Inbox.findById(inboxId)
		.then(function (foundInbox) {
			req.inbox = foundInbox;
			next();
		})
		.catch(next);
});

router.get('/:inboxId', function (req, res) {
	res.json(req.inbox);
});

router.put('/:inboxId', function (req, res, next) {
	if(req.body.delete) {
		Inbox.remove({ _id: req.inbox._id })
			.then(function () {
				res.sendStatus(200);
			})
			.catch(next);
	} else {
		Inbox.findByIdAndUpdate(req.inbox._id, req.body, { new: true })
			.then(function (updatedInbox) {
				res.json(updatedInbox);
			})
			.catch(next);
	}
});

router.use('/:inboxId/tasks', require('../tasks'));

module.exports = router;