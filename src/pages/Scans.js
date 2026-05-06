import React, { useState, useEffect } from 'react';
import { getScans, getFarms, createScan } from '../services/api';
import Navbar from '../components/Navbar';

const Scans = () => {
  const [scans, setScans] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    farm: '',
    zone_name: '',
    severity: 'Healthy',
    confidence: '',
    affected_area: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [scansRes, farmsRes] = await Promise.all([
        getScans(),
        getFarms(),
      ]);
      setScans(scansRes.data.results || scansRes.data);
      setFarms(farmsRes.data.results || farmsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createScan({
        ...formData,
        farm: parseInt(formData.farm),
        confidence: parseFloat(formData.confidence),
        affected_area: parseFloat(formData.affected_area) || 0,
      });
      setShowForm(false);
      setFormData({ farm: '', zone_name: '', severity: 'Healthy', confidence: '', affected_area: '' });
      loadData();
      alert('Scan recorded successfully!');
    } catch (error) {
      alert('Failed to record scan');
    }
  };

  const getSeverityColor = (severity) => {
    if (severity === 'Severe') return '#f44336';
    if (severity === 'Moderate') return '#ff9800';
    if (severity === 'Mild') return '#ffc107';
    return '#4caf50';
  };

  if (loading) return <div style={styles.loading}>Loading scans...</div>;

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>🔬 Scans</h1>
          <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
            + Record Scan
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <select name="farm" value={formData.farm} onChange={(e) => setFormData({ ...formData, farm: e.target.value })} style={styles.input} required>
              <option value="">Select Farm</option>
              {farms.map(farm => (
                <option key={farm.id} value={farm.id}>{farm.name}</option>
              ))}
            </select>
            <input type="text" name="zone_name" placeholder="Zone Name" value={formData.zone_name} onChange={(e) => setFormData({ ...formData, zone_name: e.target.value })} style={styles.input} required />
            <select name="severity" value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: e.target.value })} style={styles.input}>
              <option value="Healthy">Healthy</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
            <input type="number" name="confidence" placeholder="Confidence %" value={formData.confidence} onChange={(e) => setFormData({ ...formData, confidence: e.target.value })} style={styles.input} required />
            <input type="number" name="affected_area" placeholder="Affected Area (m²)" value={formData.affected_area} onChange={(e) => setFormData({ ...formData, affected_area: e.target.value })} style={styles.input} />
            <button type="submit" style={styles.submitBtn}>Record Scan</button>
          </form>
        )}

        <div style={styles.scansList}>
          {scans.length === 0 ? (
            <p>No scans yet. Click "Record Scan" to add one.</p>
          ) : (
            scans.map(scan => (
              <div key={scan.id} style={{ ...styles.scanCard, borderLeftColor: getSeverityColor(scan.severity) }}>
                <h3>{scan.zone_name}</h3>
                <p>Farm: {scan.farm_name || scan.farm}</p>
                <p style={{ color: getSeverityColor(scan.severity), fontWeight: 'bold' }}>Severity: {scan.severity}</p>
                <p>Confidence: {scan.confidence}%</p>
                <p>Affected Area: {scan.affected_area} m²</p>
                <p>Date: {new Date(scan.date).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  container: { maxWidth: 1200, margin: '0 auto', padding: 20 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  pageTitle: { fontSize: 28, color: '#333' },
  loading: { textAlign: 'center', padding: 50 },
  addButton: { background: '#2e7d32', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 5, cursor: 'pointer' },
  form: { background: 'white', padding: 20, borderRadius: 10, marginBottom: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: 10, marginBottom: 10, border: '1px solid #ddd', borderRadius: 5 },
  submitBtn: { background: '#2e7d32', color: 'white', border: 'none', padding: 10, borderRadius: 5, cursor: 'pointer', width: '100%' },
  scansList: { display: 'flex', flexDirection: 'column', gap: 15 },
  scanCard: { background: 'white', padding: 20, borderRadius: 10, borderLeftWidth: 4, borderLeftStyle: 'solid', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
};

export default Scans;