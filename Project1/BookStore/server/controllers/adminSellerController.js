const User = require('../models/User');
const Book = require('../models/Book');

// @desc    Get all sellers with their book inventory
// @route   GET /api/admin/sellers-inventory
// @access  Private/Admin
const getSellersInventory = async (req, res) => {
    try {
        // Get all sellers
        const sellers = await User.find({ isSeller: true }).select('-password');
        
        // Get inventory for each seller
        const sellersWithInventory = await Promise.all(
            sellers.map(async (seller) => {
                const books = await Book.find({ user: seller._id });
                
                return {
                    _id: seller._id,
                    name: seller.name,
                    email: seller.email,
                    isSeller: seller.isSeller,
                    isAdmin: seller.isAdmin,
                    totalBooks: books.length,
                    totalValue: books.reduce((sum, book) => sum + (book.price * book.countInStock), 0),
                    totalStock: books.reduce((sum, book) => sum + book.countInStock, 0),
                    books: books.map(book => ({
                        _id: book._id,
                        title: book.title,
                        author: book.author,
                        price: book.price,
                        countInStock: book.countInStock,
                        genre: book.genre,
                        image: book.image
                    }))
                };
            })
        );

        res.json(sellersWithInventory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching sellers inventory' });
    }
};

module.exports = {
    getSellersInventory
};
