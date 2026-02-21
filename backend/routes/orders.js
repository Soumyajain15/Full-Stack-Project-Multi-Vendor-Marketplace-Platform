const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Create Order (Buyer)
router.post('/', auth, async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;
        let totalAmount = 0;
        const processedItems = [];

        // Validate products and deduct stock
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product || product.stock < item.quantity) {
                console.error(`Order Failed: Product ${item.product} not found or out of stock (Requested: ${item.quantity}, Stock: ${product?.stock})`);
                return res.status(400).send({ error: `Product ${product?.name || 'Unknown'} out of stock or not found.` });
            }

            product.stock -= item.quantity;
            await product.save();

            totalAmount += product.price * item.quantity;
            processedItems.push({
                product: product._id,
                vendor: product.vendor,
                quantity: item.quantity,
                price: product.price
            });
        }

        const order = new Order({
            buyer: req.user._id,
            items: processedItems,
            totalAmount,
            shippingAddress
        });

        await order.save();
        res.status(201).send(order);
    } catch (e) {
        console.error('Order Error:', e);
        res.status(400).send({ error: e.message });
    }
});

// Get Buyer Orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id }).populate('items.product');
        res.send(orders);
    } catch (e) {
        res.status(500).send();
    }
});

// Get Vendor Orders
router.get('/vendor-orders', auth, authorize('vendor'), async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ user: req.user._id });
        // This is a bit complex in MongoDB, we filter orders containing items for this vendor
        const orders = await Order.find({ 'items.vendor': vendor._id }).populate('items.product');
        res.send(orders);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
