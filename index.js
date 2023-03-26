const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const config = require('config')
const startUpDebugger = require('debug')('app:startup')

const { logger, authenticator } = require('./middlewares')
const { courses, home } = require('./routes')

// Setup Express
const app = express()
app.set('view engine', 'pug')
app.set('views', './views')

// Built in middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// Third party middlewares
app.use(helmet())

if (app.get('env') === 'development') {
  app.use(morgan('dev'))
  startUpDebugger(`Morgan enabled for ${config.get('appName')} ...`)
}

// Custom middlewares
app.use(logger)
app.use(authenticator)

// Routes
app.use('/', home)
app.use('/api/courses', courses)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))
