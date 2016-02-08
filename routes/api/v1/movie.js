var express = require('express')
var omdb = require('omdb-client')
var router = module.exports = express.Router()

function handleError(res, err) {
  return res.status(500).json({
    err: err
  })
}

router.get('/', function (req, res, next) {
    console.log('[movie.js](/) req query:', req.query)
    if (!req.query.id) {
      return res.status(200).json({
        'message': 'No title was given.'
      })
    } else {
      var params = {
        id : req.query.id
      }
      omdb.get(params, function (err, data) {
        if (err) {
          return handleError(res, err)
        }
        console.log('[movie.js](/id='
        + req.query.id
        + ') got back', data)
        return res.status(200).json(data)
      })
    }
})