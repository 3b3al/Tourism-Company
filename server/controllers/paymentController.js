const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const AppError = require('../utils/AppError');
const HttpResponse = require('../utils/HttpResponse');
const paymentConfig = require('../config/paymentGateways');

exports.createStripeCheckoutSession = async (req, res) => {
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId).populate('tour');

        if (!booking) {
            throw new AppError('Booking not found', 404);
        }

        if (booking.tourist.toString() !== req.user.id) {
            throw new AppError('Not authorized to pay for this booking', 403);
        }

        // Create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${process.env.FRONTEND_URL}/payment/success/${booking._id}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel/${booking._id}`,
            customer_email: req.user.email,
            client_reference_id: booking._id.toString(),
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: booking.totalPrice * 100, // Stripe expects amount in cents
                        product_data: {
                            name: booking.tour.title,
                            description: `Booking for ${booking.numberOfPeople} people on ${new Date(booking.selectedDate).toLocaleDateString()}`,
                            images: booking.tour.images && booking.tour.images.length > 0 ? [booking.tour.images[0]] : [],
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
        });

        return HttpResponse.success(res, { sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe error:', error);
        const statusCode = error.statusCode || 500;
        return HttpResponse.error(res, error.message, statusCode);
    }
};

exports.getPaymentMethods = async (req, res) => {
    const methods = Object.keys(paymentConfig).map(key => ({
        id: key,
        name: paymentConfig[key].name || key.charAt(0).toUpperCase() + key.slice(1),
        active: paymentConfig[key].active
    }));

    return HttpResponse.success(res, { methods });
};

exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const bookingId = session.client_reference_id;

        await Booking.findByIdAndUpdate(bookingId, {
            paymentStatus: 'paid',
            status: 'confirmed'
        });
    }

    res.json({ received: true });
};
