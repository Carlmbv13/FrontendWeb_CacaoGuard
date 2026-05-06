import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const styles = {
    nav: {
      background: '#2e7d32',
      color: 'white',
      padding: '15px 0'
    },
    navContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
      textDecoration: 'none'
    },
    navLinks: {
      display: 'flex',
      gap: '20px',
      alignItems: 'center'
    },
    link: {
      color: 'white',
      textDecoration: 'none',
      padding: '8px 16px',
      borderRadius: '5px'
    },
    user: {
      marginLeft: '20px',
      padding: '8px 16px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '5px'
    },
    logoutBtn: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '5px',
      cursor: 'pointer'
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        <Link to="/" style={styles.logo}>
          🌱 CacaoGuard
        </Link>
        <div style={styles.navLinks}>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/farms" style={styles.link}>Farms</Link>
          <Link to="/scans" style={styles.link}>Scans</Link>
          <Link to="/alerts" style={styles.link}>Alerts</Link>
          {user && <span style={styles.user}>👤 {user.username}</span>}
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;