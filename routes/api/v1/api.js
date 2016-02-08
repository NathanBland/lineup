var express = require('express')

var router = module.exports = express.Router()

router.use('/search', require('./search'))
router.use('/movie', require('./movie'))

router.get('/', function(req, res, next) {
    return res.status(200).json({
        'message': 'Welcome to the watch list API.',
        'resources': '/api/v1/search'
    })
})