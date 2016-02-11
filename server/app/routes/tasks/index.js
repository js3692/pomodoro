'use strict';

var router = require('express').Router();
module.exports = router;

var ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) next();
  else res.status(401).end();
};

var ensureAdmin = function (req, res, next) {
  if (req.isAdmin()) next();
  else res.status(401).end();
};

router.get('/', ensureAuthenticated, ensureAdmin, function (req, res) {
  res.sendStatus(200);
});