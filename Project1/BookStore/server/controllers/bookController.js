const Book = require('../models/Book');

// @desc    Fetch all books
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
    const keyword = req.query.keyword
        ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const genre = req.query.genre ? { genre: req.query.genre } : {};

    const books = await Book.find({ ...keyword, ...genre }).populate('user', 'name');
    res.json(books);
};

// @desc    Fetch single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
    const book = await Book.findById(req.params.id).populate('user', 'name');

    if (book) {
        res.json(book);
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
};

// @desc    Create new review
// @route   POST /api/books/:id/reviews
// @access  Private
const createBookReview = async (req, res) => {
    const { rating, comment } = req.body;

    const book = await Book.findById(req.params.id);

    if (book) {
        const alreadyReviewed = book.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Book already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        book.reviews.push(review);

        book.numReviews = book.reviews.length;

        book.rating =
            book.reviews.reduce((acc, item) => item.rating + acc, 0) /
            book.reviews.length;

        await book.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Seller/Admin
const deleteBook = async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
        // Check if user is admin or owns the book
        if (req.user.isAdmin || book.user.toString() === req.user._id.toString()) {
            await book.deleteOne();
            res.json({ message: 'Book removed' });
        } else {
            res.status(403).json({ message: 'Not authorized to delete this book' });
        }
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Seller/Admin
const createBook = async (req, res) => {
    const { title, price, image, author, genre, countInStock, description, previewText, samplePages, popular } = req.body;

    const book = new Book({
        title,
        price,
        user: req.user._id,
        image,
        author,
        genre,
        countInStock,
        numReviews: 0,
        description,
        previewText,
        samplePages,
        popular: popular || false
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Seller/Admin
const updateBook = async (req, res) => {
    const {
        title,
        price,
        description,
        image,
        author,
        genre,
        countInStock,
        previewText,
        samplePages,
        popular
    } = req.body;

    const book = await Book.findById(req.params.id);

    if (book) {
        // Check if user is admin or owns the book
        if (req.user.isAdmin || book.user.toString() === req.user._id.toString()) {
            book.title = title;
            book.price = price;
            book.description = description;
            book.image = image;
            book.author = author;
            book.genre = genre;
            book.countInStock = countInStock;
            book.previewText = previewText;
            book.samplePages = samplePages;
            if (popular !== undefined) book.popular = popular;

            const updatedBook = await book.save();
            res.json(updatedBook);
        } else {
            res.status(403).json({ message: 'Not authorized to update this book' });
        }
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
};

module.exports = {
    getBooks,
    getBookById,
    createBookReview,
    deleteBook,
    createBook,
    updateBook
};
