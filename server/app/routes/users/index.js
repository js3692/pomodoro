'use strict';

var router = require('express').Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

var ensureAuthenticated = function (req, res, next) {
	// Attached in passport.js middleware
  if (req.isAuthenticated()) next();
  else res.status(401).end();
};

// var ensureAdmin = function (req, res, next) {
//   if (req.user.isAdmin()) next();
//   else res.status(401).end();
// };

// CURRENT REQ PATH: /api/users

router.post('/', function (req, res, next) {
	User.create(req.body)
		.then(function () {
			res.sendStatus(200);
		}).catch(next);
});

router.use(ensureAuthenticated);

router.param('userId', function (req, res, next, userId) {
	// Check if the request is for oneself
	if (userId === req.user.id) next();
	else res.sendStatus(403);
});

router.get('/:userId', function (req, res, next) {
	try {
		res.json(req.user.sanitize());
	} catch (err) { next(err); }
});

router.put('/:userId', function (req, res, next) {
	User.findByIdAndUpdate(req.user.id, req.body, { new: true })
		.then(function (updatedUser) {
			res.json(updatedUser.sanitize());
		})
		.catch(next);
});

router.use('/:userId/inbox', require('../inbox'));

module.exports = router;