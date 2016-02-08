var express = require('express')

var router = module.exports = express.Router()

router.get('/', function(req, res, next) {
    return res.status(200).json({
        allowed: 'google'
    })
})