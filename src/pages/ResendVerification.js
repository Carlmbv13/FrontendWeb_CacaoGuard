import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/resend-verification/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || 'Verification email sent! Please check your inbox.');
      } else {
        setError(data.message || 'Failed to resend verification email.');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📧 Resend Verification Email</h1>
        <p style={styles.subtitle}>Enter your email to receive a new verification link</p>
        
        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </form>
        
        <p style={styles.link}>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { 
    minHeight: '100vh', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    background: '#f5f5f5' 
  },
  card: { 
    background: 'white', 
    padding: 40, 
    borderRadius: 10, 
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
    width: 450 
  },
  title: { 
    textAlign: 'center', 
    color: '#2e7d32', 
    marginBottom: 10,
    fontSize: 24
  },
  subtitle: { 
    textAlign: 'center', 
    color: '#666', 
    marginBottom: 30 
  },
  input: { 
    width: '100%', 
    padding: 12, 
    marginBottom: 15, 
    border: '1px solid #ddd', 
    borderRadius: 5, 
    fontSize: 16,
    boxSizing: 'border-box'
  },
  button: { 
    width: '100%', 
    padding: 12, 
    background: '#2e7d32', 
    color: 'white', 
    border: 'none', 
    borderRadius: 5, 
    fontSize: 16, 
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  error: { 
    background: '#ffebee', 
    color: '#c62828', 
    padding: 12, 
    borderRadius: 5, 
    marginBottom: 15, 
    textAlign: 'center' 
  },
  success: { 
    background: '#e8f5e9', 
    color: '#2e7d32', 
    padding: 12, 
    borderRadius: 5, 
    marginBottom: 15, 
    textAlign: 'center' 
  },
  link: { 
    textAlign: 'center', 
    marginTop: 20, 
    color: '#666' 
  }
};

export default ResendVerification;