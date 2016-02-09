var User = require('../../models/User.js')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

var google = new GoogleStrategy({
    clientID: '180731629661-0fdk4tom75hp98h1e8fbbbmht4m8vj07.apps.googleusercontent.com',
    clientSecret: 'kjSHqSc3eM-L7jtUWtbDoLNR',
    callbackURL: 'https://lineup-nathanbland.c9users.io/login/google/return'
  }, function(accessToken, refreshToken, profile, cb) {
    process.nextTick(function() {
      User.findOne({
          'google.id': profile.id
      }, function(err, user) {
          if (err)
            return cb(err)
          if (user) {
            return cb(null, user)
          }
          else {
            var newUser = new User();
            newUser.google.id = profile.id
            newUser.google.token = accessToken
            newUser.google.name = profile.displayName
            newUser.google.email = profile.emails[0].value
  
            newUser.save(function(err) {
              if (err) {
                console.log(err)
                throw (err)
              }
              return cb(null, newUser)
            })
          }
      })
    })
  })
  
module.exports = google