const Stripe = require("stripe")
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const PaymentController = {
    async createPayment(req, res){
        try {
            const {amount, currency} = req.body;
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency
            });
            res.status(200).send({clientSecret: paymentIntent.client_secret})
        } catch (error) {
            res.status(500).send({ msg: "Error creating payment intent", error });
        }
    }
};
module.exports = PaymentController;