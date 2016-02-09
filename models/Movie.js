var mongoose = require('mongoose')

var Vote = mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    vote: Number
})

var Movie = mongoose.Schema({
    list_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'list'
    },
    imdbID: String,
    votes: [Vote]
  })

module.exports = mongoose.model('movie', Movie)