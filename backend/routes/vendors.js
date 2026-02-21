const express = require('express');
const Vendor = require('../models/Vendor');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Register as a Vendor
router.post('/register', auth, async (req, res) => {
    try {
        const { storeName, description } = req.body;
        const vendor = new Vendor({
            user: req.user._id,
            storeName,
            description
        });
        await vendor.save();

        // Update user role to vendor if it was buyer
        if (req.user.role === 'buyer') {
            req.user.role = 'vendor';
            await req.user.save();
        }

        res.status(201).send(vendor);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Get Vendor Profile (Public)
router.get('/:id', async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.id).populate('user', 'name');
        if (!vendor) return res.status(404).send();
        res.send(vendor);
    } catch (e) {
        res.status(500).send();
    }
});

// Get all vendors (Admin only)
router.get('/', auth, authorize('admin'), async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('user', 'name email');
        res.send(vendors);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
