const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users'); // We'll create this next or mock it
const books = require('./data/books');
const User = require('./models/User');
const Book = require('./models/Book');
const Order = require('./models/Order');
// const connectDB = require('./config/db');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const importData = async () => {
    try {
        await Order.deleteMany();
        await Book.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        const sampleBooks = books.map((book) => {
            const reviews = book.reviews ? book.reviews.map(review => ({ ...review, user: adminUser })) : [];
            return { ...book, user: adminUser, reviews, numReviews: reviews.length, rating: reviews.reduce((acc, item) => item.rating + acc, 0) / (reviews.length || 1) };
        });

        await Book.insertMany(sampleBooks);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Book.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
