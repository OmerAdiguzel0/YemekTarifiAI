import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          AI Yemek Tarifi
        </Link>
        
        <div className="navbar-menu">
          {currentUser ? (
            <>
              <span className="navbar-username">Merhaba, {currentUser.username}</span>
              <button className="navbar-logout" onClick={handleLogout}>
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Giriş Yap</Link>
              <Link to="/register" className="navbar-link">Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;