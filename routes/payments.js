const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/PaymentController");

router.post("/create-payment-intent", PaymentController.createPayment);
router.post("/webhook", express.raw({ type: 'application/json' }), PaymentController.stripeWebhook);

module.exports = router;