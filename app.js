const express = require('express')
const path = require('path')
const routes = require('./routes/index')
const app = express()

app.use(routes)
app.use(express.static(path.join(__dirname, './static')))

module.exports = app
