import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User as UserIcon, LogOut, LayoutDashboard, Settings } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-card" style={{ margin: '0 20px 20px', padding: '15px 30px', borderRadius: '0 0 16px 16px' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none' }}>
                    MarketZeto
                </Link>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Link to="/" className="btn btn-secondary">Home</Link>
                    <Link to="/cart" className="btn btn-secondary">
                        <ShoppingCart size={20} />
                    </Link>

                    {user ? (
                        <>
                            {user.role === 'vendor' && (
                                <Link to="/vendor" className="btn btn-secondary">
                                    <LayoutDashboard size={20} /> Dashboard
                                </Link>
                            )}
                            {user.role === 'admin' && (
                                <Link to="/admin" className="btn btn-secondary">
                                    <Settings size={20} /> Admin
                                </Link>
                            )}
                            <button onClick={handleLogout} className="btn btn-secondary">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary">Login</Link>
                            <Link to="/register" className="btn btn-primary">Join</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
