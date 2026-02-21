import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const AdminPanel = () => {
    const [stats, setStats] = useState({ totalRevenue: 0, totalVendors: 0, pendingVendors: 0 });
    const [vendors, setVendors] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const statsRes = await axios.get('http://localhost:5000/api/admin/stats', config);
                setStats(statsRes.data);
                const vendorRes = await axios.get('http://localhost:5000/api/vendors', config);
                setVendors(vendorRes.data);
                const ordersRes = await axios.get('http://localhost:5000/api/admin/orders', config);
                setOrders(ordersRes.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const handleStatusUpdate = async (vendorId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/admin/vendors/${vendorId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setVendors(vendors.map(v => v._id === vendorId ? { ...v, status } : v));
        } catch (e) {
            alert('Failed to update status');
        }
    };

    const handleOrderStatusUpdate = async (orderId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/admin/orders/${orderId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
        } catch (e) {
            alert('Failed to update order status');
        }
    };

    return (
        <div className="animate-fade">
            <h1 style={{ marginBottom: '40px' }}>Admin Control Center</h1>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '40px' }}>
                <div className="glass-card">
                    <TrendingUp size={24} color="var(--primary)" />
                    <h3>Platform Revenue</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="glass-card">
                    <Users size={24} color="var(--primary)" />
                    <h3>Total Vendors</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalVendors}</p>
                </div>
                <div className="glass-card">
                    <AlertCircle size={24} color="var(--secondary)" />
                    <h3>Pending Approvals</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.pendingVendors}</p>
                </div>
            </div>

            <h2>Vendor Management</h2>
            <div className="glass-card" style={{ marginTop: '20px', marginBottom: '40px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>Store Name</th>
                            <th style={{ padding: '15px' }}>Owner</th>
                            <th style={{ padding: '15px' }}>Status</th>
                            <th style={{ padding: '15px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map(v => (
                            <tr key={v._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '15px' }}>{v.storeName}</td>
                                <td style={{ padding: '15px' }}>{v.user?.name}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        background: v.status === 'approved' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: v.status === 'approved' ? '#4ade80' : '#f87171'
                                    }}>
                                        {v.status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                                    {v.status === 'pending' && (
                                        <>
                                            <button onClick={() => handleStatusUpdate(v._id, 'approved')} className="btn btn-primary" style={{ padding: '5px 10px', background: '#22c55e' }}>
                                                <CheckCircle size={16} />
                                            </button>
                                            <button onClick={() => handleStatusUpdate(v._id, 'rejected')} className="btn btn-secondary" style={{ padding: '5px 10px' }}>
                                                <XCircle size={16} />
                                            </button>
                                        </>
                                    )}
                                    {v.status === 'approved' && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Comm:</span>
                                            <input
                                                type="number"
                                                defaultValue={v.commissionRate || 10}
                                                style={{ width: '50px', padding: '3px', background: 'var(--bg-dark)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                                                onBlur={async (e) => {
                                                    const newRate = parseInt(e.target.value);
                                                    if (newRate >= 0 && newRate <= 100) {
                                                        try {
                                                            const token = localStorage.getItem('token');
                                                            await axios.patch(`http://localhost:5000/api/admin/vendors/${v._id}/commission`,
                                                                { commissionRate: newRate },
                                                                { headers: { Authorization: `Bearer ${token}` } }
                                                            );
                                                            // Optional: indicate success to user
                                                        } catch (err) {
                                                            alert('Failed to update commission rate');
                                                        }
                                                    }
                                                }}
                                            />
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>%</span>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h2>Recent Platform Orders</h2>
            <div className="glass-card" style={{ marginTop: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>Order ID</th>
                            <th style={{ padding: '15px' }}>Buyer</th>
                            <th style={{ padding: '15px' }}>Items</th>
                            <th style={{ padding: '15px' }}>Total Amount</th>
                            <th style={{ padding: '15px' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '15px', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found.</td>
                            </tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '15px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                                    <td style={{ padding: '15px' }}>{order.buyer?.name} ({order.buyer?.email})</td>
                                    <td style={{ padding: '15px' }}>{order.items.reduce((acc, item) => acc + item.quantity, 0)} items</td>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>${order.totalAmount.toFixed(2)}</td>
                                    <td style={{ padding: '15px' }}>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                background: 'var(--bg-dark)',
                                                color: order.status === 'delivered' ? '#4ade80' :
                                                    order.status === 'cancelled' ? '#f87171' :
                                                        order.status === 'shipped' ? '#fbbf24' : '#38bdf8',
                                                border: '1px solid var(--border)',
                                                outline: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="pending">PENDING</option>
                                            <option value="processing">PROCESSING</option>
                                            <option value="shipped">SHIPPED</option>
                                            <option value="delivered">DELIVERED</option>
                                            <option value="cancelled">CANCELLED</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;
