const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    updateUserProfile,
    getCart,
    updateCart,
    createUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(registerUser).get(protect, admin, getUsers).post(protect, admin, createUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/cart').get(protect, getCart).put(protect, updateCart);
router.route('/wishlist').get(protect, getWishlist);
router.route('/wishlist/:id').post(protect, addToWishlist).delete(protect, removeFromWishlist);
router.route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser);

module.exports = router;
