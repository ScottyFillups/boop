const router = require('express').Router()

router.get('/:roomId', (req, res) => {
  res.redirect(`/controller/${req.params.roomId}`)
})

module.exports = router
