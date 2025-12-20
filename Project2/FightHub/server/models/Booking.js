const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    uppercase: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  flightName: String,
  origin: String,
  destination: String,
  departureTime: Date,
  passengers: {
    type: Number,
    required: true,
    min: 1,
    max: 9
  },
  seatClass: {
    type: String,
    enum: ['economy', 'premium-economy', 'business', 'first-class'],
    required: true
  },
  seats: [{
    seatNumber: String,
    passengerName: String,
    passengerAge: Number
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'debit-card', 'upi', 'net-banking', 'wallet'],
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  journeyDate: Date,
  email: String,
  mobile: String,
  specialRequests: String,
  extras: {
    meals: Boolean,
    extraBaggage: Boolean,
    insurance: Boolean
  }
}, {
  timestamps: true
});

// Index for efficient querying
bookingSchema.index({ userId: 1, bookingDate: -1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ status: 1 });

// Generate booking ID before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingId = `BK${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
