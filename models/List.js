var mongoose = require('mongoose')
var Movie = require('./Movie')
var userRef = mongoose.Schema({
  user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
  }
})
var List = mongoose.Schema({
    title: String,
    alias: String,
    users: [userRef]
  })

List.methods.getMovies = function (cb) {
  return Movie.find({
    list_id: this._id
  }, cb)
}

List.methods.getMovieById = function (id, cb) {
  return Movie.findOne({
    list_id: this._id,
    imdbID: id
  }, cb)
}

List.methods.addMovie = function () {
  var movie = new Movie()
  movie.list_id = this._id
  return movie
}

List.methods.removeMovie = function (movie, cb) {
  Movie.findOneAndremove({
    _id: movie._id,
    list_id: this._id
  }, cb)
}

module.exports = mongoose.model('list', List)