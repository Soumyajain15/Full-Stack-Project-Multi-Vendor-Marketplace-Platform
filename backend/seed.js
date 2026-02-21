const mongoose = require('mongoose');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log('Connected to MongoDB for seeding');

    // Find an admin user
    let user = await User.findOne({ role: 'admin' });
    if (!user) {
        user = new User({ name: 'Admin', email: 'admin@test.com', password: '123', role: 'admin' });
        await user.save();
    }

    const vendorsCount = await Vendor.countDocuments();
    if (vendorsCount === 0) {
        const vendor = new Vendor({
            user: user._id,
            storeName: 'Premium Tech Store',
            description: 'The best gadgets.',
            status: 'approved'
        });
        await vendor.save();

        const products = [
            { vendor: vendor._id, name: 'Quantum Laptop', description: 'Next generation speed.', price: 1999, stock: 50, category: 'Electronics', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop' },
            { vendor: vendor._id, name: 'Ergo Chair', description: 'Perfect posture.', price: 300, stock: 20, category: 'Furniture', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&auto=format&fit=crop' },
            { vendor: vendor._id, name: 'Noise Cancel Headphones', description: 'Pure silence.', price: 250, stock: 100, category: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop' }
        ];
        await Product.insertMany(products);
        console.log('Seeded database with vendor and products.');
    } else {
        console.log('Database already has vendors.');
    }
    process.exit(0);
});
