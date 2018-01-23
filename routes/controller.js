const path = require('path')
const router = require('express').Router()

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/controller.html'))
})

module.exports = router
