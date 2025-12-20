const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const User = require('../models/User');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { flightId, passengers, seatClass, seats, paymentMethod, extras } = req.body;

    // Find flight
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ 
        success: false, 
        message: 'Flight not found' 
      });
    }

    // Check availability
    if (flight.availableSeats < passengers) {
      return res.status(400).json({ 
        success: false, 
        message: 'Not enough seats available' 
      });
    }

    // Find class price
    const classInfo = flight.classes.find(c => c.className === seatClass);
    const pricePerSeat = classInfo ? classInfo.price : flight.basePrice;
    const totalPrice = pricePerSeat * passengers;

    // Get user info
    const user = await User.findById(req.user.id);

    // Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      flightId: flight._id,
      flightName: flight.flightName,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departureTime,
      passengers,
      seatClass,
      seats: seats || [],
      price: pricePerSeat,
      totalPrice,
      paymentMethod,
      journeyDate: flight.departureTime,
      email: user.email,
      mobile: user.profile?.phone || '',
      extras: extras || {}
    });

    // Update flight availability
    flight.availableSeats -= passengers;
    if (classInfo) {
      classInfo.availableSeats -= passengers;
    }
    await flight.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error creating booking' 
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('flightId')
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error fetching bookings' 
    });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'username email')
      .populate('flightId')
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error fetching bookings' 
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'username email profile')
      .populate('flightId');

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Check if user owns this booking or is admin
    if (booking.userId._id.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to access this booking' 
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error fetching booking' 
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Check authorization
    if (booking.userId.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this booking' 
      });
    }

    booking.status = status || booking.status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error updating booking' 
    });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Check authorization
    if (booking.userId.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to cancel this booking' 
      });
    }

    // Check if booking can be cancelled (not already cancelled or completed)
    if (booking.status === 'cancelled') {
      return res.status(400).json({ 
        success: false, 
        message: 'Booking is already cancelled' 
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel a completed booking' 
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Restore flight seats
    const flight = await Flight.findById(booking.flightId);
    if (flight) {
      flight.availableSeats += booking.passengers;
      const classInfo = flight.classes.find(c => c.className === booking.seatClass);
      if (classInfo) {
        classInfo.availableSeats += booking.passengers;
      }
      await flight.save();
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Refund will be processed within 5-7 business days.',
      data: booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error cancelling booking' 
    });
  }
};

// @desc    Reschedule booking to a different flight
// @route   PUT /api/bookings/:id/reschedule
// @access  Private
exports.rescheduleBooking = async (req, res) => {
  try {
    const { newFlightId } = req.body;
    
    if (!newFlightId) {
      return res.status(400).json({ 
        success: false, 
        message: 'New flight ID is required' 
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Check authorization
    if (booking.userId.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to reschedule this booking' 
      });
    }

    // Check if booking can be rescheduled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot reschedule a cancelled booking' 
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot reschedule a completed booking' 
      });
    }

    // Find the new flight
    const newFlight = await Flight.findById(newFlightId);
    if (!newFlight) {
      return res.status(404).json({ 
        success: false, 
        message: 'New flight not found' 
      });
    }

    // Check if new flight has enough seats
    if (newFlight.availableSeats < booking.passengers) {
      return res.status(400).json({ 
        success: false, 
        message: 'Not enough seats available on the new flight' 
      });
    }

    // Check if new flight is in the future
    if (new Date(newFlight.departureTime) <= new Date()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot reschedule to a past flight' 
      });
    }

    // Check if it's the same flight
    if (booking.flightId.toString() === newFlightId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please select a different flight to reschedule' 
      });
    }

    // Restore seats to old flight
    const oldFlight = await Flight.findById(booking.flightId);
    if (oldFlight) {
      oldFlight.availableSeats += booking.passengers;
      const oldClassInfo = oldFlight.classes.find(c => c.className === booking.seatClass);
      if (oldClassInfo) {
        oldClassInfo.availableSeats += booking.passengers;
      }
      await oldFlight.save();
    }

    // Find class price for new flight
    const newClassInfo = newFlight.classes.find(c => c.className === booking.seatClass);
    const newPricePerSeat = newClassInfo ? newClassInfo.price : newFlight.basePrice;
    const newTotalPrice = newPricePerSeat * booking.passengers;

    // Calculate price difference
    const priceDifference = newTotalPrice - booking.totalPrice;

    // Update seats on new flight
    newFlight.availableSeats -= booking.passengers;
    if (newClassInfo) {
      newClassInfo.availableSeats -= booking.passengers;
    }
    await newFlight.save();

    // Update booking with new flight details
    booking.flightId = newFlight._id;
    booking.flightName = newFlight.flightName;
    booking.origin = newFlight.origin;
    booking.destination = newFlight.destination;
    booking.departureTime = newFlight.departureTime;
    booking.journeyDate = newFlight.departureTime;
    booking.price = newPricePerSeat;
    booking.totalPrice = newTotalPrice;
    await booking.save();

    let message = 'Booking rescheduled successfully!';
    if (priceDifference > 0) {
      message += ` Additional charge of ₹${priceDifference.toLocaleString()} will be processed.`;
    } else if (priceDifference < 0) {
      message += ` Refund of ₹${Math.abs(priceDifference).toLocaleString()} will be processed.`;
    }

    res.status(200).json({
      success: true,
      message,
      data: booking,
      priceDifference
    });
  } catch (error) {
    console.error('Reschedule booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error rescheduling booking' 
    });
  }
};

// @desc    Get available flights for rescheduling
// @route   GET /api/bookings/:id/reschedule-options
// @access  Private
exports.getRescheduleOptions = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Check authorization
    if (booking.userId.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view reschedule options' 
      });
    }

    // Find flights with same route and enough seats
    const availableFlights = await Flight.find({
      origin: booking.origin,
      destination: booking.destination,
      availableSeats: { $gte: booking.passengers },
      departureTime: { $gt: new Date() },
      status: 'scheduled',
      _id: { $ne: booking.flightId } // Exclude current flight
    }).sort({ departureTime: 1 });

    res.status(200).json({
      success: true,
      count: availableFlights.length,
      data: availableFlights,
      currentBooking: {
        passengers: booking.passengers,
        seatClass: booking.seatClass,
        totalPrice: booking.totalPrice
      }
    });
  } catch (error) {
    console.error('Get reschedule options error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error fetching reschedule options' 
    });
  }
};
