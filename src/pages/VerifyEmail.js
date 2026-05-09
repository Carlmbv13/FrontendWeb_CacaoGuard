import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const { token } = useParams();

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/verify-email/${token}/`);
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Unable to connect to server. Please try again later.');
    }
  };

  if (status === 'verifying') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loader}></div>
          <h2>Verifying your email...</h2>
          <p>Please wait while we confirm your email address.</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.successTitle}>Email Verified!</h2>
          <p style={styles.message}>{message}</p>
          <Link to="/login" style={styles.button}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.errorIcon}>❌</div>
        <h2 style={styles.errorTitle}>Verification Failed</h2>
        <p style={styles.message}>{message}</p>
        <Link to="/login" style={styles.button}>
          Back to Login
        </Link>
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
    background: '#f5f5f5',
    padding: '20px',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  loader: {
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #2e7d32',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px auto',
  },
  successIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  successTitle: {
    color: '#2e7d32',
    marginBottom: '10px',
  },
  errorTitle: {
    color: '#f44336',
    marginBottom: '10px',
  },
  message: {
    color: '#666',
    marginBottom: '30px',
  },
  button: {
    display: 'inline-block',
    padding: '12px 24px',
    background: '#2e7d32',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
  },
};

// Add keyframes for loader
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default VerifyEmail;