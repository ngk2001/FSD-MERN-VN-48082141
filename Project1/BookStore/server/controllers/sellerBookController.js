const Book = require('../models/Book');

// @desc    Get all books available for sellers to add
// @route   GET /api/seller-books/available
// @access  Private/Seller
const getAvailableBooks = async (req, res) => {
    try {
        const sellerId = req.user._id;
        
        // Get all books
        const allBooks = await Book.find({}).populate('user', 'name email');
        
        // Get books owned by OTHER sellers (not admin, not this seller)
        // This allows sellers to add books from admin's catalog
        const User = require('../models/User');
        const otherSellers = await User.find({ 
            isSeller: true, 
            isAdmin: false,  // Exclude admin
            _id: { $ne: sellerId }  // Exclude current seller
        });
        const otherSellerIds = otherSellers.map(s => s._id);
        
        // Get books owned by other sellers
        const otherSellerBooks = await Book.find({ user: { $in: otherSellerIds } });
        
        // Also get books owned by THIS seller
        const myBooks = await Book.find({ user: sellerId });
        
        // Create signatures of books to exclude
        const excludeSignatures = new Set([
            ...otherSellerBooks.map(b => `${b.title}-${b.author}`.toLowerCase()),
            ...myBooks.map(b => `${b.title}-${b.author}`.toLowerCase())
        ]);
        
        // Filter: Show books that are NOT owned by this seller or other sellers
        // (Admin's books ARE shown)
        const availableBooks = allBooks.filter(book => {
            const signature = `${book.title}-${book.author}`.toLowerCase();
            return !excludeSignatures.has(signature);
        });
        
        res.json(availableBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching available books' });
    }
};

// @desc    Add an existing book to seller's inventory (CLONE IT)
// @route   POST /api/seller-books
// @access  Private/Seller
const addBookToInventory = async (req, res) => {
    try {
        const { bookId, price, countInStock } = req.body;
        const sellerId = req.user._id;
        
        // Check if original book exists
        const originalBook = await Book.findById(bookId);
        if (!originalBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        // Check if THIS seller already has this book
        const myExistingBook = await Book.findOne({ 
            user: sellerId,
            title: originalBook.title,
            author: originalBook.author
        });
        
        if (myExistingBook) {
            return res.status(400).json({ message: 'You already have this book in your inventory' });
        }
        
        // Check if OTHER sellers (not admin) already have this book
        const User = require('../models/User');
        const otherSellers = await User.find({ 
            isSeller: true, 
            isAdmin: false,  // Exclude admin
            _id: { $ne: sellerId }  // Exclude current seller
        });
        const otherSellerIds = otherSellers.map(s => s._id);
        
        const otherSellerBook = await Book.findOne({ 
            user: { $in: otherSellerIds },
            title: originalBook.title,
            author: originalBook.author
        });
        
        if (otherSellerBook) {
            const owner = await User.findById(otherSellerBook.user);
            return res.status(400).json({ 
                message: `This book is already being sold by ${owner?.name || 'another seller'}. Only one seller can sell each book.` 
            });
        }
        
        // Clone the book
        const newBook = new Book({
            user: sellerId,
            title: originalBook.title,
            author: originalBook.author,
            image: originalBook.image,
            description: originalBook.description,
            genre: originalBook.genre,
            formats: originalBook.formats,
            quotes: originalBook.quotes,
            samplePages: originalBook.samplePages,
            previewText: originalBook.previewText,
            price: price || originalBook.price,
            countInStock: countInStock || 0,
            numReviews: 0,
            rating: 0,
            reviews: []
        });
        
        const createdBook = await newBook.save();
        res.status(201).json(createdBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding book to inventory' });
    }
};

// @desc    Get seller's book inventory
// @route   GET /api/seller-books/my-inventory
// @access  Private/Seller
const getMyInventory = async (req, res) => {
    try {
        const sellerId = req.user._id;
        // Just return empty array because we will fetch everything via standard /api/books
        // or we can return the books here if we want to keep the route working
        const myBooks = await Book.find({ user: sellerId }).sort({ createdAt: -1 });
        res.json(myBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching inventory' });
    }
};

// @desc    Update seller's book inventory
// @route   PUT /api/seller-books/:id
// @access  Private/Seller
const updateSellerBook = async (req, res) => {
    // This route might not be needed if we use standard book update, 
    // but for compatibility with the frontend call:
    try {
        const { price, countInStock } = req.body;
        const sellerId = req.user._id;
        
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        if (book.user.toString() !== sellerId.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        book.price = price !== undefined ? price : book.price;
        book.countInStock = countInStock !== undefined ? countInStock : book.countInStock;
        
        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating book' });
    }
};

// @desc    Remove book from seller's inventory
// @route   DELETE /api/seller-books/:id
// @access  Private/Seller
const removeFromInventory = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        if (book.user.toString() !== sellerId.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        await book.deleteOne();
        res.json({ message: 'Book removed from inventory' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing book' });
    }
};

module.exports = {
    getAvailableBooks,
    addBookToInventory,
    getMyInventory,
    updateSellerBook,
    removeFromInventory
};
