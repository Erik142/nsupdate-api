var fs = require('fs')
var path = require('path')

const relativeConfigPath = './config.json'
const configPath = path.join(__dirname, relativeConfigPath)

var config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

module.exports = config