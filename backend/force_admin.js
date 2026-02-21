const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    let adminUser = await User.findOne({ email: 'admin@marketzeto.com' });

    if (adminUser) {
        console.log('Admin already exists! Resetting password...');
        adminUser.password = 'admin123';
        adminUser.role = 'admin';
        await adminUser.save();
    } else {
        console.log('Creating fresh admin account...');
        adminUser = new User({
            name: 'Super Admin',
            email: 'admin@marketzeto.com',
            password: 'admin123',
            role: 'admin'
        });
        await adminUser.save();
    }

    console.log('Credentials successfully forced:');
    console.log('Email: admin@marketzeto.com');
    console.log('Password: admin123');
    process.exit(0);
});
