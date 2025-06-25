const mongoose = require("mongoose")
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: ['user', 'admin', 'masajista'], default: 'user' },

    purchases: [{
        massageId: {type: ObjectId, ref: 'Massage' },
        date: { type: Date, default: Date.now },
        price: Number
    }],

    reviews: [{ 
        massageId: {type: ObjectId, ref: 'Massage' },
        comment: String,
        rating: { type: Number, min: 1, max: 5 },
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const User = mongoose.model('User', UserSchema)

module.exports = User;