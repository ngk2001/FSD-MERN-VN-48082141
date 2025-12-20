const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            isPaid: paymentMethod === 'Cash on Delivery' ? false : true,
            paidAt: paymentMethod === 'Cash on Delivery' ? null : Date.now()
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

const getSellerOrders = async (req, res) => {
    const Book = require('../models/Book');
    // Find all books by this seller
    const books = await Book.find({ user: req.user._id });
    const bookIds = books.map(b => b._id.toString());

    // Find orders that contain any of these books
    const orders = await Order.find({ 'orderItems.product': { $in: bookIds } })
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

    // Calculate seller-specific total for each order
    const sellerOrders = orders.map(order => {
        const orderObj = order.toObject();
        
        let sellerTotal = 0;
        
        // Calculate total only for items that belong to this seller
        orderObj.orderItems.forEach(item => {
            if (bookIds.includes(item.product.toString())) {
                // item.price is the price at time of purchase
                sellerTotal += item.price * item.qty;
            }
        });
        
        orderObj.sellerTotal = sellerTotal;
        
        // Optional: Filter orderItems to only show seller's items in the response?
        // For now, we keep all items but the frontend should probably highlight or filter them if needed.
        // But for the dashboard "Revenue" calculation, sellerTotal is key.
        
        return orderObj;
    });

    res.json(sellerOrders);
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getSellerOrders
};
