const Flight = require('../models/Flight');

// @desc    Get all flights with filters
// @route   GET /api/flights
// @access  Public
exports.getAllFlights = async (req, res) => {
  try {
    const { origin, destination, date, departureDate, seatClass, minPrice, maxPrice } = req.query;
    
    let query = {
      status: 'scheduled'
    };

    // Filter by origin (case-insensitive, partial match)
    if (origin) {
      query.origin = origin.toUpperCase();
    }
    
    // Filter by destination (case-insensitive, partial match)
    if (destination) {
      query.destination = destination.toUpperCase();
    }
    
    // Handle date filtering - use either 'date' or 'departureDate' parameter
    const searchDateStr = date || departureDate;
    if (searchDateStr) {
      const searchDate = new Date(searchDateStr);
      searchDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.departureTime = {
        $gte: searchDate,
        $lt: nextDay
      };
    } else {
      // If no date specified, show all future flights
      query.departureTime = { $gte: new Date() };
    }

    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    const flights = await Flight.find(query).sort({ departureTime: 1 });

    res.status(200).json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    console.error('Get flights error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error fetching flights' 
    });
  }
};

// @desc    Get single flight
// @route   GET /api/flights/:id
// @access  Public
exports.getFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({ 
        success: false, 
        message: 'Flight not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: flight
    });
  } catch (error) {
    console.error('Get flight error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error fetching flight' 
    });
  }
};

// @desc    Create new flight (Admin only)
// @route   POST /api/flights
// @access  Private/Admin
exports.createFlight = async (req, res) => {
  try {
    const flightData = req.body;

    // Generate flight ID if not provided
    if (!flightData.flightId) {
      const airline = flightData.airline.substring(0, 2).toUpperCase();
      const random = Math.floor(1000 + Math.random() * 9000);
      flightData.flightId = `${airline}${random}`;
    }

    // Set available seats to total seats initially
    if (!flightData.availableSeats) {
      flightData.availableSeats = flightData.totalSeats;
    }

    const flight = await Flight.create(flightData);

    res.status(201).json({
      success: true,
      message: 'Flight created successfully',
      data: flight
    });
  } catch (error) {
    console.error('Create flight error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error creating flight' 
    });
  }
};

// @desc    Update flight (Admin only)
// @route   PUT /api/flights/:id
// @access  Private/Admin
exports.updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!flight) {
      return res.status(404).json({ 
        success: false, 
        message: 'Flight not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Flight updated successfully',
      data: flight
    });
  } catch (error) {
    console.error('Update flight error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error updating flight' 
    });
  }
};

// @desc    Delete flight (Admin only)
// @route   DELETE /api/flights/:id
// @access  Private/Admin
exports.deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);

    if (!flight) {
      return res.status(404).json({ 
        success: false, 
        message: 'Flight not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Flight deleted successfully'
    });
  } catch (error) {
    console.error('Delete flight error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error deleting flight' 
    });
  }
};

// @desc    Search flights
// @route   POST /api/flights/search
// @access  Public
exports.searchFlights = async (req, res) => {
  try {
    const { origin, destination, departureDate, returnDate, passengers, seatClass } = req.body;

    const searchDate = new Date(departureDate);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const query = {
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departureTime: {
        $gte: searchDate,
        $lt: nextDay
      },
      availableSeats: { $gte: passengers || 1 },
      status: 'scheduled'
    };

    const flights = await Flight.find(query).sort({ departureTime: 1 });

    res.status(200).json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    console.error('Search flights error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error searching flights' 
    });
  }
};
