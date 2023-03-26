const express = require('express')
const config = require('config')

// Router setup
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', {
    title: config.get('appName'),
    headerText: 'Hello world!'
  })
})

module.exports = router
