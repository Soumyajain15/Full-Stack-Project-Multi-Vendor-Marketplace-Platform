async function testOrder() {
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'fast1@test.com', password: '123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;

        // get a product
        const productsRes = await fetch('http://localhost:5000/api/products');
        const productsData = await productsRes.json();
        const product = productsData[0];

        // create order
        console.log('Testing Order...');
        const orderRes = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                items: [{ product: product._id, quantity: 1 }],
                shippingAddress: { street: '123 Test', city: 'City', state: 'ST', zipCode: '12345' }
            })
        });
        const r = await orderRes.text();
        console.log('Result:', r);
    } catch (err) {
        console.error('Failure:', err);
    }
}

testOrder();
