const mongoose = require('mongoose');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log('Connected to MongoDB for additional seeding');

    const vendor = await Vendor.findOne();
    if (!vendor) {
        console.log('Run the initial seed first to create a vendor.');
        process.exit(0);
    }

    const products = [
        { vendor: vendor._id, name: 'Ultra HD Monitor', description: 'Crystal clear 4K visuals for creative professionals.', price: 499, stock: 35, category: 'Electronics', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop' },
        { vendor: vendor._id, name: 'Mechanical Keyboard', description: 'Tactile typing experience with RGB lighting.', price: 150, stock: 75, category: 'Accessories', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop' },
        { vendor: vendor._id, name: 'Smart Watch Series X', description: 'Track your health and stay connected on the go.', price: 299, stock: 120, category: 'Wearables', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop' },
        { vendor: vendor._id, name: 'Wireless Mouse', description: 'Ergonomic design with ultra-low latency.', price: 80, stock: 200, category: 'Accessories', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop' },
        { vendor: vendor._id, name: 'Standing Desk', description: 'Adjustable height for a healthier workspace.', price: 599, stock: 15, category: 'Furniture', image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500&auto=format&fit=crop' },
        { vendor: vendor._id, name: 'Gaming Console Pro', description: 'Next-gen gaming performance.', price: 499, stock: 40, category: 'Entertainment', image: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=500&auto=format&fit=crop' },
        { vendor: vendor._id, name: 'Minimalist Backpack', description: 'Water-resistant and spacious for daily carry.', price: 120, stock: 60, category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop' },
        { vendor: vendor._id, name: 'Bluetooth Speaker', description: 'Deep bass and 360-degree sound.', price: 180, stock: 90, category: 'Audio', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop' },
        { vendor: vendor._id, name: 'Smart Home Hub', description: 'Control all your devices from one place.', price: 220, stock: 85, category: 'Smart Home', image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500&auto=format&fit=crop' }
    ];

    await Product.insertMany(products);
    console.log('Successfully injected 9 additional high-quality products into the Marketplace.');

    process.exit(0);
});
