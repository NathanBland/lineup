var express = require('express')
var omdb = require('omdb-client')
var router = module.exports = express.Router()

function handleError(res, err) {
  return res.status(500).json({
    err: err
  })
}

router.get('/', function (req, res, next) {
    console.log('[search.js](/) req query:', req.query)
    if (!req.query.title) {
      return res.status(200).json({
        'message': 'No title was given.'
      })
    } else {
      var params = {
        query : req.query.title
      }
      omdb.search(params, function (err, data) {
        if (err) {
          return handleError(res, err)
        } else {
          console.log('[search.js](/title='
          + req.query.title
          + ') got back', data)
          return res.status(200).json(data)
        }
      })
    }
})