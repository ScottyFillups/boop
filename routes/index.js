const router = require('express').Router()

router.use('/', require('./home'))
//router.use('/controller', require('./controller'))
//router.use('/game', require('./game'))
//router.use('/lobby', require('./lobby'))

module.exports = router
