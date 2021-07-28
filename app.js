var express = require('express')
var updaterouter = require('./router/updaterouter')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/v1/update', updaterouter)