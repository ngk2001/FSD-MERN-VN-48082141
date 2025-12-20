const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  flightName: {
    type: String,
    required: [true, 'Flight name is required']
  },
  airline: {
    type: String,
    required: [true, 'Airline is required']
  },
  origin: {
    type: String,
    required: [true, 'Origin is required'],
    uppercase: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    uppercase: true
  },
  departureTime: {
    type: Date,
    required: [true, 'Departure time is required']
  },
  arrivalTime: {
    type: Date,
    required: [true, 'Arrival time is required']
  },
  duration: {
    type: String,
    required: true
  },
  totalSeats: {
    type: Number,
    required: [true, 'Total seats is required'],
    min: 1
  },
  availableSeats: {
    type: Number,
    required: true
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: 0
  },
  classes: [{
    className: {
      type: String,
      enum: ['economy', 'premium-economy', 'business', 'first-class'],
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  status: {
    type: String,
    enum: ['scheduled', 'boarding', 'departed', 'arrived', 'cancelled', 'delayed'],
    default: 'scheduled'
  },
  gate: String,
  terminal: String,
  aircraft: String
}, {
  timestamps: true
});

// Index for efficient searching
flightSchema.index({ origin: 1, destination: 1, departureTime: 1 });
flightSchema.index({ flightId: 1 });

// Virtual for checking if flight is bookable
flightSchema.virtual('isBookable').get(function() {
  return this.availableSeats > 0 && 
         this.status === 'scheduled' && 
         new Date(this.departureTime) > new Date();
});

module.exports = mongoose.model('Flight', flightSchema);
