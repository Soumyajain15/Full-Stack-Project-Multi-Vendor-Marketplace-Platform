const express = require('express');
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Get Platform Stats
router.get('/stats', auth, authorize('admin'), async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            { $match: { status: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const vendorCount = await Vendor.countDocuments();
        const pendingVendors = await Vendor.countDocuments({ status: 'pending' });

        res.send({
            totalRevenue: totalSales[0]?.total || 0,
            totalVendors: vendorCount,
            pendingVendors
        });
    } catch (e) {
        res.status(500).send();
    }
});

// Moderate Vendor Status
router.patch('/vendors/:id/status', auth, authorize('admin'), async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).send({ error: 'Invalid status' });
        }

        const vendor = await Vendor.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!vendor) return res.status(404).send();

        res.send(vendor);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Update Vendor Commission Rate
router.patch('/vendors/:id/commission', auth, authorize('admin'), async (req, res) => {
    try {
        const { commissionRate } = req.body;
        if (typeof commissionRate !== 'number' || commissionRate < 0 || commissionRate > 100) {
            return res.status(400).send({ error: 'Invalid commission rate. Must be between 0 and 100.' });
        }

        const vendor = await Vendor.findByIdAndUpdate(req.params.id, { commissionRate }, { new: true });
        if (!vendor) return res.status(404).send();

        res.send(vendor);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Get All Orders (Admin only)
router.get('/orders', auth, authorize('admin'), async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('buyer', 'name email')
            .populate('items.product', 'name price')
            .sort({ createdAt: -1 });
        res.send(orders);
    } catch (e) {
        res.status(500).send();
    }
});

// Update Order Status (Admin only)
router.patch('/orders/:id/status', auth, authorize('admin'), async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).send({ error: 'Invalid order status' });
        }

        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).send();

        res.send(order);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
