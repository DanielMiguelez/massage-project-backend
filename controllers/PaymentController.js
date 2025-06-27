const Stripe = require("stripe")
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");

const PaymentController = {
    async createPayment(req, res){
        try {
            const { amount, currency, userId, orderId } = req.body;
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency
            });
            
            const payment = await Payment.create({
                amount,
                currency,
                stripePaymentIntentId: paymentIntent.id,
                status: "pending",
                ...(userId && { userId }),
                ...(orderId && { orderId })
            });

            res.status(200).send({ clientSecret: paymentIntent.client_secret , payment});
        } catch (error) {
            res.status(500).send({ msg: "Error creating payment intent", error });
        }
    },
    
    async stripeWebhook(req, res) {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            console.log("Webhook signature verification failed.", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Maneja los eventos que te interesan
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            // Actualiza el estado del pago en tu base de datos
            await Payment.findOneAndUpdate(
                { stripePaymentIntentId: paymentIntent.id },
                { status: "completed", transactionId: paymentIntent.id }
            );
        } else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object;
            await Payment.findOneAndUpdate(
                { stripePaymentIntentId: paymentIntent.id },
                { status: "failed" }
            );
        }
        // Puedes manejar más eventos si lo necesitas

        res.json({ received: true });
    }
};
module.exports = PaymentController;