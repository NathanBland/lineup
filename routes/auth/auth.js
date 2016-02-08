var express = require('express')
var passport = require('passport')
var mongoose = require('mongoose')
var User = require('../../models/User.js')
var router = module.exports = express.Router()

var twitterStrategy = require('passport-twitter-token').Strategy

//router.use('/twitter', require('./twitter'))
// router.use('/google', require('./google'))

passport.use(new twitterStrategy({
  consumerKey: 	'xBSiGGZomxNY1jBP7dirhSvxN',
  consumerSecret: 'W1NoMJ2M8I1Gu39bJhSRLtdF078WFcEfVzlh4QOZI8tMDGWuUq',
  requestTokenURL: 'https://api.twitter.com/oauth/request_token',
  accessTokenURL: 'https://api.twitter.com/oauth/access_token',
  userAuthorizationURL: 'https://api.twitter.com/oauth/authorize',
  callbackURL: 'https://lineup-nathanbland.c9users.io/login/twitter/return'
}, function(token, tokenSecret, profile, done) {
  console.log('[twitter.js](new twitter) profile id:', profile.id)
    User.findOne({
      'twitter.id': profile.id
    }, function(err, user) {
      if (err)
        return done(err)
      if (user) {
        return done(null, user);
      }
      else {
        var newUser = new User()
        newUser.twitter.id = profile.id
        newUser.twitter.token = token
        newUser.twitter.username = profile.username
        newUser.twitter.displayName = profile.displayName
        newUser.save(function(err) {
          if (err)
            throw err;
          return done(null, newUser);
        })
      }
    })
}))

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

router.use(passport.initialize())
router.use(passport.session())

router.use(function(req, res, next) {
  var user = req.user
  console.log('[auth.js](use user):', req.user)
  if (user) {
    res.locals.user = {
      username: user.username
    }
  }
  next()
})

router.get('/login', function (req, res, next) {
  return res.render('login', {
    title: 'Sign On | Watch List'
  })
})

/**
 * 
 * Twitter
 * 
**/
router.get('/login/twitter', passport.authenticate('twitter'))
router.get('/login/twitter/return', function(req, res, next) {
  console.log('[auth/routes.js](/login/twitter/return) hit twitter cb')
  passport.authenticate('twitter', function (err, user, info) {
    console.log('authenticating..')
    if (err) { 
      console.log('err:', err)
      return next(err) 
    }
    if (user) {
      console.log('user:', user)
    }
    console.log('info:', info)
    if (!user) { return res.redirect('/login') }
    req.logIn(user, function (err) {
      if (err) {
        return next(err)
      }
      return res.redirect('/test')
    })(req, res, next)
  })
})

//router.use(require('./routes'))

/*router.get('/', function(req, res, next) {
  return res.status(200).json({
    allowed: 'twitter, google'
  })
})*/