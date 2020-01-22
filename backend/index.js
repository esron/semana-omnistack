require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const routes = require('./src/routes')
const { setUpWebsocket } = require('./src/websocket')

const app = express()
const server = http.Server(app)

setUpWebsocket(server)

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.use(cors())

app.use(express.json())

app.use(routes)

server.listen(3333)
