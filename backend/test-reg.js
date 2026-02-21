const axios = require('axios');

async function testRegister() {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Test Setup User',
            email: `test${Date.now()}@test.com`,
            password: 'password123',
            role: 'buyer'
        });
        console.log('Success:', res.data);
    } catch (err) {
        console.error('Failure:', err.response?.data || err.message);
    }
}

testRegister();
