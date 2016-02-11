'use strict';

var router = require('express').Router();
module.exports = router;

router.use('/users', require('./users'));
router.use('/tasks', require('./tasks'));
router.use('/inbox', require('./inbox'));

router.use(function (req, res) {
  res.status(404).end();
});
