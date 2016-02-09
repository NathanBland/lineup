var express = require('express')
var omdb = require('omdb-client')
var router = module.exports = express.Router()
var Lists = require('../../models/List')

function handleError(res, err) {
  return res.render('index', {
    title: 'Watch List',
    error: 'No valid title'
  })
}

router.get('/', function (req, res, next) {
  console.log('[lists.js](/) GET')
  Lists.find({'users.user_id': req.user._id})
    .sort('-id')
    .exec(function (err, results){
      console.log('[lists.js](/) results:', results)
      if (err) {
        next(err)
      }
      return res.render('lists', {
        title: 'Lists | Watch List',
        lists: results
      })
    })
})

router.get('/:alias', function (req, res, next) {
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