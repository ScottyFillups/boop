const router = require('express').Router()

router.use('/', require('./home'))
router.use('/controller', require('./controller'))
router.use('/host', require('./host'))

module.exports = router
