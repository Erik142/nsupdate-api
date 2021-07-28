var express = require('express')
var updaterouter = require('./router/updaterouter')
var config = require('./config/config')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/v1/update', updaterouter)

app.listen(config.port, config.listenAddress)