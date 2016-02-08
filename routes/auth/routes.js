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
  /*passport.authenticate('twitter', {
    successRedirect: '/test',
    failureRedirect: '/login'
  })*/
})
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