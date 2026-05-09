import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await login(username, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      if (result.error?.includes('verify') || result.error?.includes('activated')) {
        setError(
          <span>
            {result.error}<br/>
            <Link to="/resend-verification" style={{ color: '#2e7d32' }}>Click here to resend verification email</Link>
          </span>
        );
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    }
    setLoading(false);
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
      padding: '40px', 
      borderRadius: '10px', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
      width: '400px' 
    },
    title: { 
      textAlign: 'center', 
      color: '#2e7d32', 
      marginBottom: '10px',
      fontSize: '28px'
    },
    subtitle: { 
      textAlign: 'center', 
      color: '#666', 
      marginBottom: '30px' 
    },
    input: { 
      width: '100%', 
      padding: '12px', 
      marginBottom: '15px', 
      border: '1px solid #ddd', 
      borderRadius: '5px', 
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    button: { 
      width: '100%', 
      padding: '12px', 
      background: loading ? '#ccc' : '#2e7d32', 
      color: 'white', 
      border: 'none', 
      borderRadius: '5px', 
      fontSize: '16px', 
      cursor: loading ? 'not-allowed' : 'pointer',
      fontWeight: 'bold'
    },
    error: { 
      background: '#ffebee', 
      color: '#c62828', 
      padding: '12px', 
      borderRadius: '5px', 
      marginBottom: '15px', 
      textAlign: 'center' 
    },
    link: { 
      textAlign: 'center', 
      marginTop: '20px', 
      color: '#666' 
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌱 CacaoGuard</h1>
        <p style={styles.subtitle}>Login to your account</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p style={styles.link}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;