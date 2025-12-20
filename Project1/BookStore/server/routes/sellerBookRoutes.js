const express = require('express');
const router = express.Router();
const { protect, seller } = require('../middleware/authMiddleware');
const {
    getAvailableBooks,
    addBookToInventory,
    getMyInventory,
    updateSellerBook,
    removeFromInventory
} = require('../controllers/sellerBookController');

router.route('/available').get(protect, seller, getAvailableBooks);
router.route('/my-inventory').get(protect, seller, getMyInventory);
router.route('/')
    .post(protect, seller, addBookToInventory);
router.route('/:id')
    .put(protect, seller, updateSellerBook)
    .delete(protect, seller, removeFromInventory);

module.exports = router;
