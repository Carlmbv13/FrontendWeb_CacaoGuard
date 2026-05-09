import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password2: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'Farmer',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password || !formData.password2) {
      setError('Please fill all required fields');
      return;
    }
    
    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (formData.email && !isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    const result = await register(formData);
    
    if (result.success) {
      setSuccess(
        formData.email 
          ? `Registration successful! A verification email has been sent to ${formData.email}. Please check your inbox and verify your email before logging in.`
          : `Registration successful! Please login to continue.`
      );
      setFormData({
        username: '',
        password: '',
        password2: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'Farmer',
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } else {
      let errorMessage = 'Registration failed. Please try again.';
      if (typeof result.error === 'string') {
        errorMessage = result.error;
      } else if (result.error?.email) {
        errorMessage = `Email: ${result.error.email.join(', ')}`;
      } else if (result.error?.username) {
        errorMessage = `Username: ${result.error.username.join(', ')}`;
      } else if (result.error?.password) {
        errorMessage = `Password: ${result.error.password.join(', ')}`;
      } else if (result.error?.detail) {
        errorMessage = result.error.detail;
      }
      setError(errorMessage);
    }
    setLoading(false);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const styles = {
    container: { 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      background: '#f5f5f5', 
      padding: '20px' 
    },
    card: { 
      background: 'white', 
      padding: '40px', 
      borderRadius: '10px', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
      width: '500px',
      maxWidth: '100%'
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
    select: { 
      width: '100%', 
      padding: '12px', 
      marginBottom: '15px', 
      border: '1px solid #ddd', 
      borderRadius: '5px', 
      fontSize: '16px',
      background: 'white',
      cursor: 'pointer'
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
      textAlign: 'center',
      border: '1px solid #ffcdd2'
    },
    success: { 
      background: '#e8f5e9', 
      color: '#2e7d32', 
      padding: '12px', 
      borderRadius: '5px', 
      marginBottom: '15px', 
      textAlign: 'center',
      border: '1px solid #c8e6c9'
    },
    link: { 
      textAlign: 'center', 
      marginTop: '20px', 
      color: '#666' 
    },
    note: {
      textAlign: 'center',
      marginTop: '15px',
      fontSize: '12px',
      color: '#999'
    },
    row: {
      display: 'flex',
      gap: '10px',
      marginBottom: '0'
    },
    halfInput: {
      width: 'calc(50% - 5px)',
      marginBottom: '15px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌱 Create Account</h1>
        <p style={styles.subtitle}>Join CacaoGuard to monitor your cacao farms</p>
        
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="username" 
            placeholder="Username *" 
            value={formData.username} 
            onChange={handleChange} 
            style={styles.input} 
            required 
          />
          
          <input 
            type="email" 
            name="email" 
            placeholder="Email (required for verification)" 
            value={formData.email} 
            onChange={handleChange} 
            style={styles.input} 
          />
          
          <div style={styles.row}>
            <input 
              type="text" 
              name="first_name" 
              placeholder="First Name" 
              value={formData.first_name} 
              onChange={handleChange} 
              style={styles.halfInput} 
            />
            
            <input 
              type="text" 
              name="last_name" 
              placeholder="Last Name" 
              value={formData.last_name} 
              onChange={handleChange} 
              style={styles.halfInput} 
            />
          </div>
          
          <input 
            type="password" 
            name="password" 
            placeholder="Password * (min 6 characters)" 
            value={formData.password} 
            onChange={handleChange} 
            style={styles.input} 
            required 
          />
          
          <input 
            type="password" 
            name="password2" 
            placeholder="Confirm Password *" 
            value={formData.password2} 
            onChange={handleChange} 
            style={styles.input} 
            required 
          />
          
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange} 
            style={styles.select}
          >
            <option value="Farmer">👨‍🌾 Farmer</option>
            <option value="Technician">🔧 Technician</option>
          </select>
          
          <button 
            type="submit" 
            style={styles.button} 
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        
        <p style={styles.link}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
        
        <p style={styles.note}>
          * Required fields. Email verification required for account activation.
        </p>
      </div>
    </div>
  );
};

export default Register;