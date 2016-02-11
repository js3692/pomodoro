'use strict';

var chalk = require('chalk');

var startDb = require('./db');

var server = require('http').createServer();

var createApplication = function () {
  var app = require('./app');
  server.on('request', app);
};

var startServer = function () {
  var PORT = process.env.PORT || 10000;

  server.listen(PORT, function () {
    console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
  });

};

startDb.then(createApplication).then(startServer).catch(function (err) {
  console.error(chalk.red(err.stack));
  process.kill(1);
});