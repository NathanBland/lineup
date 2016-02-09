var express = require('express')
var passport = require('passport')
var twitterStrategy = require('passport-twitter').Strategy
var User = require('../../models/User.js')

var twitter = new twitterStrategy({
  consumerKey: 	'xBSiGGZomxNY1jBP7dirhSvxN',
  consumerSecret: 'W1NoMJ2M8I1Gu39bJhSRLtdF078WFcEfVzlh4QOZI8tMDGWuUq',
  callbackURL: 'https://lineup-nathanbland.c9users.io/login/twitter/return'
}, function(token, tokenSecret, profile, cb) {
  process.nextTick(function () {
    User.findOne({
      'twitter.id': profile.id
    }, function (err, user) {
      if (err) {
        return cb(err)
      }
      if (user) {
        return cb(null, user)
      } else {
        var newUser = new User()
        newUser.twitter.id = profile.id
        newUser.twitter.token = token
        newUser.twitter.username = profile.username
        newUser.twitter.displayName = profile.displayName
        newUser.save(function (err) {
          if (err) {
            throw err
          }
          return cb(null, newUser)
        })
      }
    })
  })
})

module.exports = twitter