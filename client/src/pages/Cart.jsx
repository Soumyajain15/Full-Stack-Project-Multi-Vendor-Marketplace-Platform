import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cartItems, removeFromCart, total, checkout } = useCart();
    const [orderSuccess, setOrderSuccess] = useState(false);

    const handleCheckout = async () => {
        try {
            await checkout({
                street: '123 Main St',
                city: 'City',
                state: 'ST',
                zipCode: '12345'
            });
            setOrderSuccess(true);
        } catch (e) {
            console.error(e);
            alert(`Checkout failed: ${e.response?.data?.error || e.message}`);
        }
    };

    if (orderSuccess) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }} className="animate-fade">
                <CheckCircle size={64} color="#22c55e" style={{ margin: '0 auto 20px', display: 'block' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Order Placed Successfully!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Thank you for your purchase. Your items will be shipped soon.</p>
                <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>Keep Shopping</Link>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <ShoppingBag size={64} color="var(--text-muted)" style={{ margin: '0 auto 20px', display: 'block' }} />
                <h2>Your cart is empty</h2>
            </div>
        );
    }

    return (
        <div className="animate-fade">
            <h1 style={{ marginBottom: '30px' }}>Your Shopping Cart</h1>
            <div className="grid" style={{ gridTemplateColumns: '1fr 350px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {cartItems.map(item => (
                        <div key={item._id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{ width: '80px', height: '80px', background: 'var(--glass)', borderRadius: '8px' }}></div>
                                <div>
                                    <h3>{item.name}</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>Price: ${item.price}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <span>Qty: {item.quantity}</span>
                                <button onClick={() => removeFromCart(item._id)} className="btn btn-secondary" style={{ color: 'var(--secondary)' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="glass-card" style={{ height: 'fit-content' }}>
                    <h2 style={{ marginBottom: '20px' }}>Summary</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        Checkout Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
