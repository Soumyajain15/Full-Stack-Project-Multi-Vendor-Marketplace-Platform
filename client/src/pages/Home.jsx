import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/products?search=${search}`);
                setProducts(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [search]);

    return (
        <div className="animate-fade">
            <section style={{ textAlign: 'center', padding: '60px 0' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Discover Premium Products</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Handpicked by our trusted vendors.</p>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </section>

            {loading ? (
                <div style={{ textAlign: 'center' }}>Loading products...</div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
