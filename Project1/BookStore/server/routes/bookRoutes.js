const express = require('express');
const router = express.Router();
const { protect, admin, seller } = require('../middleware/authMiddleware');
const {
    getBooks,
    getBookById,
    createBookReview,
    deleteBook,
    createBook,
    updateBook
} = require('../controllers/bookController');

router.route('/').get(getBooks).post(protect, seller, createBook);
router.route('/:id')
    .get(getBookById)
    .delete(protect, seller, deleteBook)
    .put(protect, seller, updateBook);
router.route('/:id/reviews').post(protect, createBookReview);

module.exports = router;
