'use strict';

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function (app) {
  app.use(session({
    secret: app.getValue('env').SESSION_SECRET,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    resave: false,
    saveUninitialized: false
  }));

  // Passport registration ======================
  app.use(passport.initialize());
  app.use(passport.session());
  // ============================================


  // Cookie encryption ==========================
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, done);
  });
  // ============================================


  // Routing for browser AJAX requests ==========
  app.get('/session', function (req, res) {
    if (req.user) {
      User.findById(req.user._id).populate('inbox')
        .then(function (foundUser) {
          res.send({ user: foundUser.sanitize() });
        });
    }
    else res.status(401).send('No authenticated user.');
  });

  app.get('/logout', function (req, res) {
    req.logout();
    res.status(200).end();
  });
  // ============================================

  require(path.join(__dirname, 'local'))(app);
  // require(path.join(__dirname, 'google'))(app);
};