const shortid = require('shortid')
const router = require('express').Router()

router.get('/', (req, res) => {
  res.redirect(`/host/${shortid.generate().substring(0, 5)}`)
})

module.exports = router
