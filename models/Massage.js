const mongoose = require("mongoose");
const MassageSchema = new mongoose.Schema({

    title: { type: String, required: true },
    description: String,
    duration: Number, // en minutos
    price: { type: Number, required: true },
    category: { type: String }, 
    image: String,

    createdBy: { type: String, default: "Matthijs" },

    reviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: String,
        rating: { type: Number, min: 1, max: 5 },
        date: { type: Date, default: Date.now }
    }]

}, { timestamps: true });

const Massage = mongoose.model('Massage', MassageSchema)
module.exports = Massage;