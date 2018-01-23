const shortid = require('shortid')
const router = require('express').Router()

router.get('/', (req, res) => {
  res.redirect(`/host/${shortid.generate()}`)
})

module.exports = router
