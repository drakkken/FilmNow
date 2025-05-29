import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../services/api';
import './Header.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const refreshUserState = () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Refreshing user state:', storedUser);
    setUser(storedUser);
  };

  useEffect(() => {
    // Initial user state
    refreshUserState();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        console.log('Storage changed:', e.newValue);
        refreshUserState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  const renderAuthButtons = () => {
    console.log('Current user state:', user);
    
    if (user?.role === 'admin') {
      return (
        <>
          <Link to="/admin" className="nav-link">Admin Dashboard</Link>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </>
      );
    } else if (user?.id) {
      return (
        <>
          <Link to="/bookings" className="nav-link">My Bookings</Link>
          <span className="welcome-text">Welcome, {user.name}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link to="/auth" className="auth-button">
            Login
          </Link>
          <Link to="/admin/login" className="admin-button">
            Admin Login
          </Link>
        </>
      );
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Movie Booking
        </Link>
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/movies" className="nav-link">Movies</Link>
          {renderAuthButtons()}
        </nav>
      </div>
    </header>
  );
};

export default Header;