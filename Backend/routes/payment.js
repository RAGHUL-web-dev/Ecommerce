const express = require('express')
const router = express.Router()
const { isAutenicatedUser} = require("../middleware/authenicate")
const { processPayment, sendStripeApi } = require('../controller/paymentController')

router.route('/payment/process').post(isAutenicatedUser, processPayment);
router.route('/stripeapi').get(isAutenicatedUser, sendStripeApi)

module.exports = router