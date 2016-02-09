var express = require('express')
var passport = require('passport')
var router = module.exports = express.Router()

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

router.get('/login/twitter/return',
  passport.authenticate('twitter', { 
    successRedirect: '/',
    failureRedirect: '/login' }))
  /*passport.authenticate('twitter', {
    successRedirect: '/test',
    failureRedirect: '/login'
  })*/
/**
 * 
 * End Twitter
 * 
**/

/**
 * 
 * Google
 * 
 */
router.get('/login/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))
router.get('/login/google/return', function(req, res, next) {
  passport.authenticate('google', {
    successRedirect: '/test2',
    failureRedirect: '/login'
  })
})

router.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})