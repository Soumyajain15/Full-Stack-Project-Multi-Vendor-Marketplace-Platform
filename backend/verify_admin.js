const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const user = await User.findOne({ email: 'admin@test.com' });
    if (!user) {
        console.log('Admin user not found!');
    } else {
        console.log('Admin found:', user.email);
        const isMatch = await user.comparePassword('123');
        console.log('Password match for 123:', isMatch);

        if (!isMatch) {
            console.log('Password hash was messed up. Resetting correctly...');
            user.password = '123'; // The pre-save hook will hash it
            await user.save();
            console.log('Password reset successfully.');
        }
    }
    process.exit(0);
});
