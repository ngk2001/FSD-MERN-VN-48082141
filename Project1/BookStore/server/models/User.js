const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    sellerRequest: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none'
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        qty: {
            type: Number,
            required: true,
            default: 1
        },
        format: {
            type: String,
            default: 'Paperback'
        }
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
