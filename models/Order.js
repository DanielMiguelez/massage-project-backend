const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    guestName: { type: String },
    guestEmail: { type: String },
    guestPhone: { type: String },
    massageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Massage', required: true },
    scheduledDate: { type: Date, required: true },
    locationType: { type: String, enum: ['local', 'domicilio'], required: true },
    address: String,
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    totalPrice: Number,
    paymentIntentId: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);