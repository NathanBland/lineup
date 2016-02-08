var express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  routes = require('./routes/'), 
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  sass = require('node-sass-middleware'),
  cookieParser = require('cookie-parser'),
  app = express()
  
app.set('dbhost', '127.0.0.1')
app.set('dbname', 'lineup')

mongoose.connect('mongodb://' + app.get('dbhost') + '/' + app.get('dbname'))

app.set('port', process.env.PORT ||8081)
app.set('ip', process.env.IP || '0.0.0.0')

app.use(
  sass({
    root: __dirname,
    indentedSyntax: true,
    src: '/sass',
    dest: '/public/css',
    prefix: '/css',
    debug: false
  })
)
    
// Set static directory to /public
app.use(express.static(__dirname +'/public'))

// Set Jade as the view engine
app.set('view engine', 'jade')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.locals.siteName = 'Watch List'

var sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection
})

app.use(cookieParser('config.cookieSecret watch list')) // these values are temporary and will be chnaged
app.use(session({
  secret: 'config.sessionSecret watch list', // these values are temporary and will be chnaged
  key: 'config.sessionSecretwatch list jet set key', // these values are temporary and will be chnaged
  store: sessionStore,
  resave: true,
  saveUninitialized: true
}))

app.use('/', routes)

app.listen(app.get('port'), app.get('ip'), function () {
  console.log('started LineUp')
})