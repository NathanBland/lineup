var express = require('express')

var router = module.exports = express.Router()

router.use('/api/v1', require('./api/v1/api'))
router.use('/movie', require('./movie/movie'))

router.get('/', function(req, res, next) {
    /*return res.status(200).json({
        'message': 'Welcome to the LineUp API'
    })*/
    return res.render('index', {
        title: 'Watch List'
    })
})