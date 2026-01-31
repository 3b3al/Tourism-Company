module.exports = {
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        active: true
    },
    paypal: {
        active: false,
        name: 'PayPal'
    },
    bankTransfer: {
        active: true,
        name: 'Bank Transfer'
    }
};
