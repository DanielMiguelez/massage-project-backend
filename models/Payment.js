const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['eur', 'usd'], required: true },
    stripePaymentIntentId: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    transactionId: String
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
