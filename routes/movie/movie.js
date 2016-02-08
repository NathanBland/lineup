var express = require('express')
var omdb = require('omdb-client')
var router = module.exports = express.Router()

function handleError(res, err) {
  return res.render('index', {
    title: 'Watch List',
    error: 'No valid title'
  })
}

router.get('/:id', function (req, res, next) {
    console.log('[movie.js](/) req query:', req.query)
    if (!req.params.id) {
      return res.render('movie', {
        title: 'Watch List',
        error: 'No valid title'
      })  
    } else {
      var params = {
        id : req.params.id
      }
      omdb.get(params, function (err, data) {
        if (err) {
          return handleError(res, err)
        }
        console.log('[movie.js](/id='
        + req.query.id
        + ') got back', data)
        return res.render('movie', {
          title: 'Watch List',
          movie: data
        })
      })
    }
})