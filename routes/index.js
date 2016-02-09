var express = require('express')
var ensureLogin = require('connect-ensure-login')
var ensureAuthenticated = ensureLogin.ensureAuthenticated

var router = module.exports = express.Router()

router.use(require('./auth/auth'))
router.use('/api/v1', require('./api/v1/api'))
router.use('/movie', require('./movie/movie'))
router.use('/lists', ensureAuthenticated('/login'))
router.use('/lists', require('./lists/lists'))

router.get('/', function(req, res, next) {
    /*return res.status(200).json({
        'message': 'Welcome to the LineUp API'
    })*/
    return res.render('index', {
        title: 'Watch List'
    })
})
router.use(function(req, res) {
  console.warn('404 Not Found: %s', req.originalUrl)
  return res.status(404).render('404', {
    title: "404 Error - Page Not Found",
    notification: {
      severity: "error",
      message: "Hey I couldn't find that page, sorry.",
      type: "e404"
   }
  })
})

// server errors
router.use(function(err, req, res, next) {
  console.log(err.stack)
  res.status(500).render('500', {
    title: "500 Error - Server Error",
    notification: {
      severity: "error",
      message: "Something is very wrong on our side. Try again later.",
      type: "e500"
    }
  })
})