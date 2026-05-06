import React, { useState, useEffect } from 'react';
import { getFarms, createFarm, deleteFarm } from '../services/api';
import Navbar from '../components/Navbar';

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size_hectares: '',
    health_score: 100,
    risk_level: 'Low',
  });

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      const response = await getFarms();
      setFarms(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading farms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFarm({
        ...formData,
        size_hectares: parseFloat(formData.size_hectares),
      });
      setShowForm(false);
      setFormData({ name: '', location: '', size_hectares: '', health_score: 100, risk_level: 'Low' });
      loadFarms();
    } catch (error) {
      alert('Failed to create farm');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteFarm(id);
        loadFarms();
      } catch (error) {
        alert('Failed to delete farm');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div style={styles.loading}>Loading farms...</div>;

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>🌾 Farms</h1>
          <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
            + Add Farm
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <input type="text" name="name" placeholder="Farm Name *" value={formData.name} onChange={handleChange} style={styles.input} required />
            <input type="text" name="location" placeholder="Location *" value={formData.location} onChange={handleChange} style={styles.input} required />
            <input type="number" name="size_hectares" placeholder="Size (hectares)" value={formData.size_hectares} onChange={handleChange} style={styles.input} />
            <select name="risk_level" value={formData.risk_level} onChange={handleChange} style={styles.input}>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
              <option value="Critical">Critical</option>
            </select>
            <button type="submit" style={styles.submitBtn}>Create Farm</button>
          </form>
        )}

        <div style={styles.farmsGrid}>
          {farms.length === 0 ? (
            <p>No farms yet. Click "Add Farm" to create one.</p>
          ) : (
            farms.map((farm) => (
              <div key={farm.id} style={styles.farmCard}>
                <h3>{farm.name}</h3>
                <p>📍 {farm.location}</p>
                <p>📏 {farm.size_hectares} hectares</p>
                <p>💚 Health: {farm.health_score}%</p>
                <p style={{ color: farm.risk_level === 'Critical' ? 'red' : 'orange' }}>
                  ⚠️ Risk: {farm.risk_level}
                </p>
                <button onClick={() => handleDelete(farm.id)} style={styles.deleteBtn}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  pageTitle: {
    fontSize: '28px',
    color: '#333'
  },
  loading: {
    textAlign: 'center',
    padding: '50px'
  },
  addButton: {
    background: '#2e7d32',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  form: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px'
  },
  submitBtn: {
    background: '#2e7d32',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%'
  },
  farmsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  farmCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  deleteBtn: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px'
  }
};
export default Farms;