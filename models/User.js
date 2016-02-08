var mongoose = require('mongoose')
var User = mongoose.Schema({
    username: {
      type: String,
      required: false
    },
    twitter: {
      id: String,
      token: String,
      displayName: String,
      username: String
    },
    google: {
      id: String,
      token: String,
      email: String,
      name: String
    }
  })

User.plugin(require('passport-local-mongoose'))
  
module.exports = mongoose.model('user', User)