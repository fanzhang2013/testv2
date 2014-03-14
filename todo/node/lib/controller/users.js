
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')

exports.signin = function (req, res) {
  console.log(">>>>>>>>>>>>>>");
}

/**
 * Auth callback
 */

exports.authCallback = function (req, res, next) {
console.log(">>>>>>Auth"+req.user);
var user = req.user;
  //res.redirect('/auth')
}

/**
 * Show login form
 */

exports.login = function (req, res) {
  console.log(">>>>>>Login");
  res.render('users/login', {
    title: 'Login',
    message: req.flash('error')
  })
}

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  console.log(">>>>>>Sign");
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  })
}

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout()
  res.redirect('/login')
}

/**
 * Session
 */

exports.session = function (req, res) {
  console.log(">>>>>>Session");
  res.redirect('/')
}

/**
 * Create user
 */

exports.create = function (req, res) {
  console.log(">>>>>>Create");
  var user = new User(req.body)
  user.provider = 'local'
  user.save(function (err) {
    if (err) {
      return res.render('users/signup', { errors: err.errors, user: user })
    }
    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.redirect('/')
    })
  })
}

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile
  res.render('users/show', {
    title: user.name,
    user: user
  })
}

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}
