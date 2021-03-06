var mongoose = require('mongoose')
var findOrCreate = require('mongoose-findorcreate')
var Vote = mongoose.Schema({
    _id: false,
    user_id: {
      type: String,
      ref: 'user'
    },
    vote: Number
})

var Movie = mongoose.Schema({
    list_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'list'
    },
    info: Object,
    imdbID: String,
    watched: Boolean,
    votes: [Vote]
  })

Movie.plugin(findOrCreate)
module.exports = mongoose.model('movie', Movie)