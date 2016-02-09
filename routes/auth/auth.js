var express = require('express')
var passport = require('passport')
var mongoose = require('mongoose')
var User = require('../../models/User.js')
var router = module.exports = express.Router()

router.use(passport.initialize())
router.use(passport.session())

passport.use('twitter', require('./twitter'))
passport.use('google', require('./google'))

passport.serializeUser(function(user, cb) {
  cb(null, user.id)
})

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    if (err) {
        console.log('uh oh error:', err)
    }
    cb(null, user)
  })
})
router.use(function (req, res, next) {
  var user = req.user
  if (user) {
    if (user.twitter) {
      res.locals.user = user.twitter
    }
  }
  next()
})

router.use(require('./routes'))

/*router.get('/', function(req, res, next) {
  return res.status(200).json({
    allowed: 'twitter, google'
  })
})*/