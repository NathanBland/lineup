var mongoose = require('mongoose')
var Movie = require('./Movie')
var ObjectId = mongoose.Schema.Types.ObjectId
var omdb = require('omdb-client')
var userRef = mongoose.Schema({
  user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
  }
})
var List = mongoose.Schema({
    title: String,
    alias: String,
    owner: userRef,
    users: [userRef]
  })

List.methods.getMovies = function (cb) {
  var list_id = this._id
  return Movie.aggregate({
    $match: {
      list_id: new ObjectId(list_id)
    }},
    {
      $project: {
        info: 1,
        imdbID: 1,
        watched: 1,
        votes: {
          $cond: {
            if: {$eq: ['$votes', []]},
            then: [null],
            else: '$votes'
          }
        }
      }
    },
    {
      $unwind: {
        path: "$votes",
        preserveNullAndEmptyArrays: true
      }   
    },
    {
      $group: {
        _id: "$_id",
        votes: {
          $sum: "$votes.vote"
        }
      }
    }, cb)
}

List.methods.getMovieById = function (id, cb) {
  return Movie.findOne({
    list_id: this._id,
    imdbID: id
  }, cb)
}

List.methods.addMovie = function (imdbID, cb) {
  var params = {
        id : imdbID
      }
  var listId = this._id
  omdb.get(params, function (err, data) {
    if (err) {
      throw err
    }
    Movie.findOrCreate({
      list_id: listId,
      imdbID: imdbID,
      info: data
    }, cb)
  })
}

List.methods.removeMovie = function (movie, cb) {
  Movie.findOneAndremove({
    _id: movie._id,
    list_id: this._id
  }, cb)
}
List.methods.removeAllMovies = function (cb) {
  Movie.find({
    list_id: this._id
  }).remove().exec(cb)
}

module.exports = mongoose.model('list', List)