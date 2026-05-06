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
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    
    const result = await register(formData);
    
    if (result.success) {
      navigate('/login');
    } else {
      setError(JSON.stringify(result.error));
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Register</h1>
        <p style={styles.subtitle}>Create your account</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username *" value={formData.username} onChange={handleChange} style={styles.input} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={styles.input} />
          <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} style={styles.input} />
          <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} style={styles.input} />
          <input type="password" name="password" placeholder="Password *" value={formData.password} onChange={handleChange} style={styles.input} required />
          <input type="password" name="password2" placeholder="Confirm Password *" value={formData.password2} onChange={handleChange} style={styles.input} required />
          
          <select name="role" value={formData.role} onChange={handleChange} style={styles.select}>
            <option value="Farmer">Farmer</option>
            <option value="Technician">Technician</option>
          </select>
          
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p style={styles.link}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5', padding: 20 },
  card: { background: 'white', padding: 40, borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: 450 },
  title: { textAlign: 'center', color: '#2e7d32', marginBottom: 10 },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: 30 },
  input: { width: '100%', padding: 12, marginBottom: 15, border: '1px solid #ddd', borderRadius: 5, fontSize: 16 },
  select: { width: '100%', padding: 12, marginBottom: 15, border: '1px solid #ddd', borderRadius: 5, fontSize: 16 },
  button: { width: '100%', padding: 12, background: '#2e7d32', color: 'white', border: 'none', borderRadius: 5, fontSize: 16, cursor: 'pointer' },
  error: { background: '#ffebee', color: '#c62828', padding: 10, borderRadius: 5, marginBottom: 15, textAlign: 'center' },
  link: { textAlign: 'center', marginTop: 20, color: '#666' },
};

export default Register;