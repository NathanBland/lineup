var mongoose = require('mongoose')
var Movie = require('./Movie')
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
  return Movie.find({
    list_id: this._id
  }, cb)
  // .sort(''), cb)
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