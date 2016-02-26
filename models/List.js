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
      list_id: list_id
    }},
    {
      $project: {
        info: 1,
        imdbID: 1,
        watched: 1,
        /*votes: {
          $ifNull: ["$votes", [{vote: 0}]]
        }*/
        votes: {
          $cond: [{$eq: ["$votes", [] ] },
          [{ vote: 0.5}],
          '$votes']
        }
      }
    },
    {
      $unwind: '$votes'
    },
    {
      $group: {
      _id:"$_id",
      votes:{ $sum: "$votes.vote"},
      vote_count:{ 
        $sum: {
          $cond: [{
            $eq: [ "$votes", 0.5]},
            0,
            1
          ]
        }
      },
      info: {$first:"$info"},
      imdbID:{$first: "$imdbID"},
      watched: {$first:"$watched"}
      }
    },
    {
     $sort: { votes: -1 } 
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
    return Movie.findOrCreate({
      list_id: listId,
      imdbID: imdbID,
      info: data
    }, cb)
  })
}
List.methods.movieVote = function(vote, imdbID, user_id, cb) {
  // var usr = new ObjectId(user_id)
  console.log('values to make things with:', vote, imdbID, user_id)
  return Movie.findOneAndUpdate({
    list_id: this._id,
    imdbID: imdbID
  }, {
    $addToSet : {
      "votes": {
        vote: vote,
        user_id: user_id
      }
    }
  },cb)
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