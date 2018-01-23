const router = require('express').Router()

router.use('/', require('./home'))
router.use('/controller', require('./controller'))
router.use('/host', require('./host'))
router.use('/invite', require('./invite'))
router.use('/create', require('./create'))

module.exports = router
