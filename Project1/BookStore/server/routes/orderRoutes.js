const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getSellerOrders
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const { getOrders, updateOrderToDelivered } = require('../controllers/adminOrderController');
const { deleteOrder } = require('../controllers/deleteOrderController');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/seller').get(protect, getSellerOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id').delete(protect, admin, deleteOrder);

module.exports = router;
