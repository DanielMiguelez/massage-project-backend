const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    amount: Number,
    currency: { type: String, enum: ['eur', 'usd'], required: true },
    method: { type: String, enum: ['card', 'paypal'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    transactionId: String
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
