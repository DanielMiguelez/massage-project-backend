const Stripe = require("stripe")
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Schedule = require("../models/Schedule");

const PaymentController = {
    async createPayment(req, res){
        try {
            const { amount, currency, userId, orderId } = req.body;
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency,
                payment_method_types: ['card']
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
            console.error("Error creating payment intent:", error);
            res.status(500).send({ msg: "Error creating payment intent", error: error.message || error });
        }
    },
    
    async stripeWebhook(req, res) {
        console.log("Webhook recibido", req.body);
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            console.log("Evento Stripe:", event.type, event.data.object.id);
        } catch (err) {
            console.log("Webhook signature verification failed.", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const payment = await Payment.findOneAndUpdate(
                { stripePaymentIntentId: paymentIntent.id },
                { status: "completed", transactionId: paymentIntent.id },
                { new: true }
            );
            console.log("Payment encontrado:", payment);
            if (payment && payment.orderId) {
                console.log("Actualizando Order con id:", payment.orderId);
                const updatedOrder = await Order.findByIdAndUpdate(payment.orderId, {
                    status: "confirmed",
                    paymentStatus: "succeeded",
                    paymentIntentId: paymentIntent.id
                }, { new: true });
                console.log("Order actualizada:", updatedOrder);
            } else {
                console.log("No se encontró orderId en el Payment");
            }
        } else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object;
            const payment = await Payment.findOneAndUpdate(
                { stripePaymentIntentId: paymentIntent.id },
                { status: "failed" },
                { new: true }
            );
            console.log("Payment (failed) encontrado:", payment);
            if (payment && payment.orderId) {
                console.log("Actualizando Order (failed) con id:", payment.orderId);
                const updatedOrder = await Order.findByIdAndUpdate(payment.orderId, {
                    status: "cancelled",
                    paymentStatus: "failed"
                }, { new: true });
                console.log("Order (failed) actualizada:", updatedOrder);
            } else {
                console.log("No se encontró orderId en el Payment (failed)");
            }
        }

        res.json({ received: true });
    },

    async cancelOrder(req, res) {
        try {
            const { orderId } = req.body;
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).send({ msg: "Order not found" });
            }

            if (order.status === "cancelled") {
                return res.status(400).send({ msg: "Order already cancelled" });
            }

            const schedule = await Schedule.findOne({
                date: order.scheduledDate,
                masajistaId: order.masajistaId
            });
            if (schedule) {
                schedule.timeSlots = schedule.timeSlots.map(slot => {
                    if (slot.startTime === order.startTime && slot.endTime === order.endTime) {
                        slot.isAvailable = true;
                        slot.orderId = null;
                    }
                    return slot;
                });
                await schedule.save();
            }

            let refund = null;
            if (order.paymentStatus === "succeeded" && order.paymentIntentId) {
                const paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
                const chargeId = paymentIntent.charges.data[0].id;
                refund = await stripe.refunds.create({ charge: chargeId });
                order.paymentStatus = "refunded";
            }

            order.status = "cancelled";
            await order.save();

            res.status(200).send({
                msg: "Order cancelled successfully",
                order,
                refund
            });
        } catch (error) {
            console.error("Error cancelling order:", error);
            res.status(500).send({ msg: "Error cancelling order", error: error.message });
        }
    }
};

module.exports = PaymentController;