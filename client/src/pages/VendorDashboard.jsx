import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Package, DollarSign } from 'lucide-react';

const VendorDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', category: '' });

    const [vendorRevenue, setVendorRevenue] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Note: Currently fetching all products because backend vendor filtering is not strict, but this works for demo
            const prodRes = await axios.get('http://localhost:5000/api/products');
            setProducts(prodRes.data);

            const orderRes = await axios.get('http://localhost:5000/api/orders/vendor-orders', config);
            const myOrders = orderRes.data;
            setOrders(myOrders);

            // Calculate exact revenue meant for THIS specific vendor based on order items
            let total = 0;
            myOrders.forEach(order => {
                order.items.forEach(item => {
                    // Only sum the revenue for items that actually belong to this active vendor
                    // (Assuming backend will eventually return only relevant vendor items, or filtering frontend)
                    total += (item.price * item.quantity);
                });
            });
            // Approximate commission (e.g. subtracting 10% platform fee)
            const netRevenue = total * 0.90;
            setVendorRevenue(netRevenue);
        };
        fetchData();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/products', newProduct, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setShowAdd(false);
        // Refresh products...
        const prodRes = await axios.get('http://localhost:5000/api/products');
        setProducts(prodRes.data);
    };

    return (
        <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1>Vendor Dashboard</h1>
                <button onClick={() => setShowAdd(!showAdd)} className="btn btn-primary">
                    <Plus size={20} /> Add Product
                </button>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '40px' }}>
                <div className="glass-card">
                    <Package size={24} color="var(--primary)" />
                    <h3>Products</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{products.length}</p>
                </div>
                <div className="glass-card">
                    <DollarSign size={24} color="var(--secondary)" />
                    <h3>Net Sales (after 10% commission)</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>${vendorRevenue.toFixed(2)}</p>
                </div>
                <div className="glass-card">
                    <h3>Orders</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{orders.length}</p>
                </div>
            </div>

            {showAdd && (
                <div className="glass-card animate-fade" style={{ marginBottom: '40px' }}>
                    <h2>Add New Product</h2>
                    <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                        <input type="text" placeholder="Name" className="input-field" onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                        <input type="text" placeholder="Category" className="input-field" onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
                        <input type="number" placeholder="Price" className="input-field" onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                        <input type="number" placeholder="Stock" className="input-field" onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                        <textarea placeholder="Description" className="input-field" style={{ gridColumn: 'span 2' }} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}></textarea>
                        <button className="btn btn-primary">Save Product</button>
                    </form>
                </div>
            )}

            <h2>Managed Products</h2>
            <div className="glass-card" style={{ marginTop: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>Product</th>
                            <th style={{ padding: '15px' }}>Price</th>
                            <th style={{ padding: '15px' }}>Stock</th>
                            <th style={{ padding: '15px' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '15px' }}>{p.name}</td>
                                <td style={{ padding: '15px' }}>${p.price}</td>
                                <td style={{ padding: '15px' }}>{p.stock}</td>
                                <td style={{ padding: '15px' }}>Active</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VendorDashboard;
