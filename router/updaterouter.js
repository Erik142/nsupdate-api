var express = require('express')
var updateController = require('../controller/updatecontroller')

var router = express.Router()

router.post('/', updateController.post)
router.delete('/', updateController.delete)

module.exports = router