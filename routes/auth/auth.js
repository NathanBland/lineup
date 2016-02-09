var express = require('express')
var passport = require('passport')
var mongoose = require('mongoose')
var User = require('../../models/User.js')
var router = module.exports = express.Router()

var twitterStrategy = require('passport-twitter-token').Strategy

router.use(passport.initialize())
router.use(passport.session())

passport.use('twitter', require('./twitter'))
// router.use('/google', require('./google'))

passport.serializeUser(function(user, cb) {
  console.log('[auth.js] serialize user:', user)
  cb(null, user.id)
})

passport.deserializeUser(function(id, cb) {
  console.log('[auth.js] deserialize user:', id)
  User.findById(id, function(err, user) {
    if (err) {
        console.log('uh oh error:', err)
    }
    cb(null, user)
  })
})

router.get('/login', function (req, res, next) {
  return res.render('login', {
    title: 'Sign On | Watch List'
  })
})
router.use(require('./routes'))

/*router.get('/', function(req, res, next) {
  return res.status(200).json({
    allowed: 'twitter, google'
  })
})*/