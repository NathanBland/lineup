var express = require('express')
var omdb = require('omdb-client')
var router = module.exports = express.Router()
var Lists = require('../../models/List')
var User = require('../../models/User')

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
      // console.log('[lists.js](/) results:', results)
      if (err) {
        next(err)
      }
      return res.render('lists', {
        title: 'Lists | Watch List',
        lists: results
      })
    })
})
router.route('/add')
  .post(function (req, res, next) {
    console.log('[lists.js](/add) POST:', req.body)
    if (!req.body.listTitle) {
      var err = 'No title provided'
      next(err)
    }
    var list = new Lists({
      title: req.body.listTitle,
      alias: req.body.listTitle.replace(/\s+/g, '') + new Date().toISOString(),
    })
    list.owner = {user_id: req.user._id}
    list.users.push({
      user_id: req.user._id
    })
    list.save(function (err) {
      if (err) {
        next(err)
      }
      return res.redirect('/lists')
    })
  })

router.get('/:alias', function (req, res, next) {
  console.log('[lists.js](/:alias) req param:', req.params.alias)
  
  Lists.findOne({'users.user_id': req.user._id, alias: req.params.alias})
    .populate('users.user_id')
    .exec(function (err, list) {
      console.log('[lists.js](/:alias) list:', list)
      if (err) {
        return next(err)
      }
      if (!list) {
        return next(err)
      }
      list.getMovies(function (err, movies){
        if (err) {
          next(err)
        }
        console.log('results of getMovies:', movies)
        return res.render('movieList', {
          title: list.title+' | Watch List',
          list: list,
          movies: movies
        })
      })
    })
})

router.route('/:alias/add/:id')
  .get(function(req, res, next) {
    console.log('[list.js](:alias/add/:id) GET')
    if (!req.params.alias || !req.params.id) {
      return next('Invalid URL')
    }
    Lists.findOne({'users.user_id': req.user._id, alias: req.params.alias})
      .exec(function (err, list) {
        if (err) {
          return next(err)
        }
        list.getMovieById(req.params.id, function(err, result) {
          if (err) {
            next(err)
          }
          if (!result) {
            list.addMovie(req.params.id, function (err, movie, created) {
              if (err) {
                return next(err)
              }
              return res.redirect('/lists/'+req.params.alias)
            })
          } else {
            return res.redirect('/lists/'+req.params.alias)
          }
        })
      })
  })

router.route('/:alias/remove')
  .post(function(req, res, next) {
    console.log('[lists.js](/:alias/remove) trying to delete list')
    if (!req.params.alias) {
      return next('No list')
    }
    Lists.findOneAndRemove({alias: req.params.alias}, function (err, result) {
      if (err) {
        next(err)
      }
      result.removeAllMovies(function (err, results) {
        if (err) {
          next(err)
        }
        return res.redirect('/lists')
      })
    })
  })

router.route('/:alias/movie/:movieId/:vote')
  .post(function(req, res, next) {
      if (!req.params.alias || !req.params.movieId || !req.params.vote) {
        console.log('[lists.js](/:alias/movie/:movieId/:vote) Error!')
        console.log('submitted params:', req.params)
        return next('invalid')
      }
      console.log('voting...')
      Lists.findOne({'users.user_id': req.user._id, alias: req.params.alias})
      .exec(function(err, list) {
        if (err) {
          return next(err)
        }
        list.movieVote(req.params.vote, req.params.movieId, req.user._id,
        function (err, result) {
          if (err) {
            return next(err)
          }
          console.log('result from voting:', result)
          return res.redirect('/lists/'+req.params.alias)
        })
      })
  })
  
router.route('/:alias/add/user/:id')
  .get(function(req, res, next) {
    Lists.findOne({'users.user_id': req.user._id, alias: req.params.alias})
    .exec(function(err, list) {
      if (err) {
        return next(err)
      }
        
    })
  })
  
router.route('/:alias/user/add/:id')
  .get(function(req, res, next) {
    if (!req.params.id) {
      return next('no valid id')
    }
    User.findOne({
      _id: req.params.id
    })
    .exec(function(err, newUser) {
      if (err) {
        return next(err)
      }
      console.log('[lists.js](/:alias/user/add/:id) adding user:', newUser)
      Lists.findOne({'users.user_id': req.user._id, alias: req.params.alias})
      .exec(function(err, list) {
        if (err) {
          return next(err)
        }
        list.update({
          $addToSet: {
            users: {user_id: newUser._id}
          }
        }, function (err) {
          if (err) {
            return next(err)
          }
          return res.redirect('/lists/'+req.params.alias)
        })
      })
    })
  })