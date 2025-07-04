const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },    
    email: { type: String, required: true },    
    comment: { type: String, required: true },  
    rating: { type: Number, min: 1, max: 5 },  
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", ReviewSchema);
