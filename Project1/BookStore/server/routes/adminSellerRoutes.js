const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getSellersInventory } = require('../controllers/adminSellerController');

router.route('/sellers-inventory').get(protect, admin, getSellersInventory);

module.exports = router;
