'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function (app) {

  var strategyFn = function (email, password, done) {
    User.findOne({ email: email })
      .then(function (user) {
        // user.correctPassword is a method from the User schema.
        if (!user || !user.correctPassword(password)) {
          done(null, false);
        } else {
          // Properly authenticated.
          done(null, user);
        }
      }, function (err) {
        done(err);
      });
  };

  passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, strategyFn));

  // A POST /login route is created to handle login.
  app.post('/login', function (req, res, next) {
    var authCb = function (err, user) {
      if (err) return next(err);

      if (!user) {
        var error = new Error('Invalid login credentials.');
        error.status = 401;
        return next(error);
      }

      // req.logIn will establish our session.
      req.logIn(user, function (loginErr) {
        if (loginErr) return next(loginErr);
        User.findById(user._id).populate('inbox')
          .then(function (foundUser) {
            res.status(200).send({
              user: foundUser.sanitize()
            });
          }).catch(next);
      });
    };

    passport.authenticate('local', authCb)(req, res, next);
  });

};
