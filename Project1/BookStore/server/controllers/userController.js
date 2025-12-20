const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (user.password === password)) { // Note: In production, use bcrypt to compare hashes
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isSeller: user.isSeller,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, sellerRequest } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password, // Note: In production, hash this password before saving
        sellerRequest: sellerRequest || 'none'
    });

    if (user) {
        // Notify admins if user requested seller status
        if (sellerRequest === 'pending') {
            const { notifyAllAdmins } = require('./notificationController');
            await notifyAllAdmins(
                'seller_request',
                'New Seller Request',
                `${user.name} (${user.email}) has requested to become a seller.`,
                user._id
            );
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isSeller: user.isSeller,
            sellerRequest: user.sellerRequest,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isSeller: user.isSeller,
            sellerRequest: user.sellerRequest,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (user) {
        res.json(user.wishlist);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Add to wishlist
// @route   POST /api/users/wishlist/:id
// @access  Private
const addToWishlist = async (req, res) => {
    const user = await User.findById(req.user._id);
    const bookId = req.params.id;

    if (user) {
        if (user.wishlist.includes(bookId)) {
            res.status(400).json({ message: 'Book already in wishlist' });
        } else {
            user.wishlist.push(bookId);
            await user.save();
            res.json({ message: 'Book added to wishlist' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:id
// @access  Private
const removeFromWishlist = async (req, res) => {
    const user = await User.findById(req.user._id);
    const bookId = req.params.id;

    if (user) {
        user.wishlist = user.wishlist.filter((id) => id.toString() !== bookId);
        await user.save();
        res.json({ message: 'Book removed from wishlist' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        isAdmin
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        const oldSellerStatus = user.isSeller;
        const oldSellerRequest = user.sellerRequest;

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
        
        // Handle seller status
        if (req.body.isSeller !== undefined) {
            user.isSeller = req.body.isSeller;
        }
        if (req.body.sellerRequest && ['none', 'pending', 'approved', 'rejected'].includes(req.body.sellerRequest)) {
            user.sellerRequest = req.body.sellerRequest;
        }

        const updatedUser = await user.save();

        // Send notifications based on status changes
        const { createNotification } = require('./notificationController');
        
        // 1. Seller Status Changes
        // If seller status was approved via request
        if (!oldSellerStatus && updatedUser.isSeller && updatedUser.sellerRequest === 'approved') {
            await createNotification(
                updatedUser._id,
                'seller_approved',
                'Seller Request Approved! 🎉',
                'Congratulations! Your seller request has been approved. You can now start selling on our platform.'
            );
        }
        // If seller request was rejected
        else if (oldSellerRequest === 'pending' && updatedUser.sellerRequest === 'rejected') {
            await createNotification(
                updatedUser._id,
                'seller_rejected',
                'Seller Request Update',
                'Your seller request has been reviewed. Please contact support for more information.'
            );
        }
        // If seller status was manually granted (without request flow or just direct edit)
        else if (!oldSellerStatus && updatedUser.isSeller) {
             await createNotification(
                updatedUser._id,
                'role_update',
                'You are now a Seller! 📚',
                'An admin has granted you seller privileges. You can now access the Seller Dashboard.'
            );
        }
        // If seller status was removed
        else if (oldSellerStatus && !updatedUser.isSeller) {
             await createNotification(
                updatedUser._id,
                'role_update',
                'Seller Privileges Revoked',
                'Your seller privileges have been removed by an admin.'
            );
        }

        // 2. Admin Status Changes
        if (!user.isAdmin && updatedUser.isAdmin) {
            await createNotification(
                updatedUser._id,
                'role_update',
                'You are now an Admin! 🛡️',
                'You have been granted administrator privileges.'
            );
        } else if (user.isAdmin && !updatedUser.isAdmin) {
             await createNotification(
                updatedUser._id,
                'role_update',
                'Admin Privileges Revoked',
                'Your administrator privileges have been removed.'
            );
        }

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            isSeller: updatedUser.isSeller,
            sellerRequest: updatedUser.sellerRequest,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        // Validation: Name
        if (req.body.name && req.body.name.trim().length < 2) {
            res.status(400);
            throw new Error('Name must be at least 2 characters');
        }
        
        // Validation: Email format
        if (req.body.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(req.body.email)) {
                res.status(400);
                throw new Error('Invalid email format');
            }
            
            // Check if email is already taken by another user
            if (req.body.email !== user.email) {
                const emailExists = await User.findOne({ email: req.body.email });
                if (emailExists) {
                    res.status(400);
                    throw new Error('Email already in use');
                }
            }
        }
        
        // Validation: Password
        if (req.body.password && req.body.password.length < 6) {
            res.status(400);
            throw new Error('Password must be at least 6 characters');
        }
        
        user.name = req.body.name ? req.body.name.trim() : user.name;
        user.email = req.body.email ? req.body.email.trim() : user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        
        // Handle seller request
        if (req.body.sellerRequest && ['none', 'pending', 'approved', 'rejected'].includes(req.body.sellerRequest)) {
            user.sellerRequest = req.body.sellerRequest;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            isSeller: updatedUser.isSeller,
            sellerRequest: updatedUser.sellerRequest,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Get user cart
// @route   GET /api/users/cart
// @access  Private
const getCart = async (req, res) => {
    const user = await User.findById(req.user._id).populate('cart.product');
    if (user) {
        // Transform to match frontend structure if needed, or just return cart
        // Frontend expects: { product, name, image, price, countInStock, qty }
        // Backend stores: { product: Object, qty }
        // We need to map it
        const cartItems = user.cart.map(item => ({
            product: item.product._id,
            name: item.product.title,
            image: item.product.image,
            price: item.product.price,
            countInStock: item.product.countInStock,
            qty: item.qty
        }));
        res.json(cartItems);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user cart
// @route   PUT /api/users/cart
// @access  Private
const updateCart = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        // Expecting array of items from frontend
        // Need to map back to schema structure: { product: ID, qty }
        const cartItems = req.body.map(item => ({
            product: item.product,
            qty: item.qty
        }));
        user.cart = cartItems;
        await user.save();
        res.json(user.cart);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
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
};
