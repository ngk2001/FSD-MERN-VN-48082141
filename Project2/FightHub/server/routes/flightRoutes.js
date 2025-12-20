const express = require('express');
const router = express.Router();
const {
  getAllFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight,
  searchFlights
} = require('../controllers/flightController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllFlights);
router.get('/:id', getFlight);
router.post('/search', searchFlights);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createFlight);
router.put('/:id', protect, authorize('admin'), updateFlight);
router.delete('/:id', protect, authorize('admin'), deleteFlight);

module.exports = router;
