const express = require('express');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all products (Public)
router.get('/', async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice } = req.query;
        let query = {};

        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(query).populate('vendor', 'storeName');
        res.send(products);
    } catch (e) {
        res.status(500).send();
    }
});

// Create Product (Vendor only)
router.post('/', auth, authorize('vendor'), async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ user: req.user._id });
        if (!vendor || vendor.status !== 'approved') {
            return res.status(403).send({ error: 'Only approved vendors can add products.' });
        }

        const product = new Product({
            ...req.body,
            vendor: vendor._id
        });
        await product.save();
        res.status(201).send(product);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Update Product (Vendor only)
router.patch('/:id', auth, authorize('vendor'), async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ user: req.user._id });
        const product = await Product.findOne({ _id: req.params.id, vendor: vendor._id });

        if (!product) return res.status(404).send();

        const updates = Object.keys(req.body);
        updates.forEach((update) => product[update] = req.body[update]);
        await product.save();
        res.send(product);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Delete Product (Vendor only)
router.delete('/:id', auth, authorize('vendor'), async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ user: req.user._id });
        const product = await Product.findOneAndDelete({ _id: req.params.id, vendor: vendor._id });

        if (!product) return res.status(404).send();
        res.send(product);
    } catch (e) {
        res.status(500).send();
    }
});

// Add Review to Product
router.post('/:id/reviews', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id).populate('vendor');

        if (!product) return res.status(404).send({ error: 'Product not found' });

        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).send({ error: 'Product already reviewed' });
        }

        const review = {
            name: req.user.name || 'Anonymous',
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();

        // Also update vendor rating
        const allVendorProducts = await Product.find({ vendor: product.vendor._id });
        const validProducts = allVendorProducts.filter(p => p.numReviews > 0);
        if (validProducts.length > 0) {
            const vendorRating = validProducts.reduce((acc, p) => p.rating + acc, 0) / validProducts.length;
            await Vendor.findByIdAndUpdate(product.vendor._id, { rating: vendorRating });
        }

        res.status(201).send({ message: 'Review added successfully' });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

module.exports = router;
