const express = require('express')
const bodyParser = require('body-parser') //middleware
const passport = require('./config/auth')
const { games, users, sessions } = require('./routes')
const http = require('http')
const socketAuth = require('./config/socket-auth')
const socketIO = require('socket.io')

const PORT = process.env.PORT || 3030

let app = express()
const server = http.Server(app)
const io = socketIO(server)

io.use(socketAuth)

io.on('connect', socket => {
  socket.emit('ping', `Welcome to the server, ${socket.request.user.name}`)
  console.log(`${socket.request.user.name} connect to the server`)
})

app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(passport.initialize())
  .use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
    next()
  }) //or yarn add cors, add const cors = require('cors') as a middleware
  .use(games) //our routes
  .use(users)
  .use(sessions)

// catch 404 and forward to error handler
  .use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  })

// final error handler
  .use((err, req, res, next) => {
    res.status(err.status || 500) //Internal Server Error
    res.send({
      message: err.message,
      //only print full errors in development
      error: app.get('env') === 'development' ? err : {}
    })
  })

  .listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
  })
