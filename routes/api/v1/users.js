var express = require('express')
var router = module.exports = express.Router()
var User = require('../../../models/User')
function handleError(res, err) {
  return res.status(500).json({
    err: err
  })
}

router.get('/', function (req, res, next) {
  console.log('[users.js](/) req query:', req.query)
  if (!req.query.name && !req.query.displayName && !req.query.username) {
    return res.status(200).json({
      'message': 'No name was given.'
    })
  } else {
    User.find({'twitter.displayName': req.query.displayName})
    .or({'twitter.username': req.query.username})
    .limit(10)
    .select('-_id google.name twitter.displayName twitter.username')
    .exec(function(err, users) {
      if (err) {
        return next(err)
      }
      return res.status(200).json({
          users: users
        })
      })
    }
})
router.get('/search', function (req, res, next) {
  console.log('[users.js](/) req query:', req.query)
  if (!req.query.name && !req.query.displayName && !req.query.username) {
    return res.status(200).json({
      'message': 'No name was given.'
    })
  } else {
    
    User.find()
    .or([{'twitter.displayName': new RegExp(req.query.name, 'i')},
      {'twitter.username': new RegExp(req.query.name, 'i')},
      {'google.name': new RegExp(req.query.name, 'i')}
    ])
  .limit(10)
  .select('google.name twitter.displayName twitter.username')
  .exec(function(err, users) {
    if (err) {
      return next(err)
    }
    console.log('results:', users)
    return res.status(200).json({
        users: users
      })
    })
  }
})