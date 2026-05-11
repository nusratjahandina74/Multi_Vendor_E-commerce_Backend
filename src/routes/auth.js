const express = require('express')
const router = express.Router()
const { registrationController } = require('../controllers/authController')
router.post('/registration', registrationController)
module.exports = router