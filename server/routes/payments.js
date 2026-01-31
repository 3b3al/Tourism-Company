const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createStripeCheckoutSession,
    getPaymentMethods,
    handleStripeWebhook
} = require('../controllers/paymentController');

router.get('/methods', protect, getPaymentMethods);
router.post('/create-checkout-session', protect, createStripeCheckoutSession);

module.exports = router;
