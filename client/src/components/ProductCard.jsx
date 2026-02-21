import React, { useState } from 'react';
import { ShoppingCart, MessageSquare, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [showReviews, setShowReviews] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState(product.reviews || []);

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) return alert('Please login to leave a review.');

            await axios.post(`http://localhost:5000/api/products/${product._id}/reviews`,
                { rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Fetch the updated, specific product
            const res = await axios.get(`http://localhost:5000/api/products`);
            // Usually we might just fetch the single product, but since the homepage pulls the array, 
            // we'll just optimistically update local state for the comment list
            setReviews([...reviews, {
                name: JSON.parse(localStorage.getItem('user'))?.name || 'You',
                rating,
                comment,
                createdAt: new Date().toISOString()
            }]);
            setComment('');
            alert('Review posted!');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to submit review. You may have already reviewed it.');
        }
    };

    return (
        <div className="glass-card animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{
                width: '100%',
                height: '200px',
                borderRadius: '12px',
                backgroundColor: 'var(--glass)',
                overflow: 'hidden'
            }}>
                {product.image ? (
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        No Image
                    </div>
                )}
            </div>

            <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>{product.category}</span>
                <h3 style={{ fontSize: '1.2rem', margin: '5px 0' }}>{product.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', height: '40px', overflow: 'hidden' }}>{product.description}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>${product.price}</span>
                <button className="btn btn-primary" style={{ padding: '8px 12px' }} onClick={() => addToCart(product)}>
                    <ShoppingCart size={18} />
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderBottom: showReviews ? '1px solid var(--border)' : 'none', paddingBottom: showReviews ? '10px' : '0' }}>
                <span>Seller: {product.vendor?.storeName || 'Unknown'} <span style={{ background: 'rgba(250, 204, 21, 0.2)', color: '#facc15', padding: '1px 4px', borderRadius: '4px', marginLeft: '4px' }}>★ {product.vendor?.rating > 0 ? product.vendor.rating.toFixed(1) : 'New'}</span></span>

                <button
                    onClick={() => setShowReviews(!showReviews)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                    <MessageSquare size={14} />
                    {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                    <span style={{ color: '#facc15' }}>★ {product.rating > 0 ? product.rating.toFixed(1) : '0'}</span>
                </button>
            </div>

            {showReviews && (
                <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '5px' }}>
                    <div style={{ maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {reviews.length === 0 ? (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>No reviews yet. Be the first!</div>
                        ) : (
                            reviews.map((r, i) => (
                                <div key={i} style={{ background: 'var(--bg-dark)', padding: '8px', borderRadius: '6px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 'bold', color: 'var(--text)' }}>{r.name}</span>
                                        <span style={{ color: '#facc15' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{r.comment}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rate:</span>
                            <input type="range" min="1" max="5" value={rating} onChange={(e) => setRating(parseInt(e.target.value))} style={{ flex: 1 }} />
                            <span style={{ fontSize: '0.8rem', color: '#facc15', fontWeight: 'bold' }}>{rating} ★</span>
                        </div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input
                                type="text"
                                placeholder="Write a review..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                style={{ flex: 1, padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-dark)', color: 'white', fontSize: '0.85rem' }}
                                required
                            />
                            <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Post</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
