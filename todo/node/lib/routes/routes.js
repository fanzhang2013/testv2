(function (exports) {
  "use strict";
  var mongoose = require('mongoose')
    , crudUtils = require('../utils/crudUtils')
    , post = mongoose.model('Post')
    , users = require('../controller/users')
    ,path = require('path')

  function index(req, res) {
    
    
    res.sendfile( path.resolve('././site/public/todo.html'));

  }
  exports.init = function (app, auth, passport) {
    app.get('/',index);
    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout)
    app.post('/users', users.create)
    app.get('/auth/facebook', passport.authenticate('facebook', { failureRedirect: '/login',scope: 'email'}), users.signin)
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback)

    app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session)
    crudUtils.initRoutesForModel({ 'app': app, 'model': post, auth: auth });
  };
}(exports));