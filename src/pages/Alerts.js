import React, { useState, useEffect } from 'react';
import { getAlerts, updateAlertStatus } from '../services/api';
import Navbar from '../components/Navbar';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const response = await getAlerts();
      setAlerts(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateAlertStatus(id, status);
      loadAlerts();
      alert(`Alert marked as ${status}`);
    } catch (error) {
      alert('Failed to update alert');
    }
  };

  const getAlertStyle = (severity) => {
    if (severity === 'critical') return { background: '#ffebee', borderLeftColor: '#f44336' };
    if (severity === 'warning') return { background: '#fff3e0', borderLeftColor: '#ff9800' };
    return { background: '#e8f5e9', borderLeftColor: '#4caf50' };
  };

  if (loading) return <div style={styles.loading}>Loading alerts...</div>;

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>🚨 Alerts</h1>

        <div style={styles.alertsList}>
          {alerts.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyEmoji}>✅</div>
              <h2>No Alerts</h2>
              <p>Your farm is healthy!</p>
            </div>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} style={{ ...styles.alertCard, ...getAlertStyle(alert.severity) }}>
                <div style={styles.alertHeader}>
                  <span style={styles.alertSeverity}>⚠️ {alert.severity.toUpperCase()}</span>
                  <span style={styles.alertStatus}>Status: {alert.status}</span>
                </div>
                <p style={styles.alertMessage}>{alert.message}</p>
                <p style={styles.alertDate}>{new Date(alert.created_at).toLocaleString()}</p>
                {alert.status === 'new' && (
                  <div style={styles.alertButtons}>
                    <button onClick={() => handleUpdateStatus(alert.id, 'acknowledged')} style={styles.acknowledgeBtn}>
                      Acknowledge
                    </button>
                    <button onClick={() => handleUpdateStatus(alert.id, 'resolved')} style={styles.resolveBtn}>
                      Resolve
                    </button>
                  </div>
                )}
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
  pageTitle: { fontSize: 28, color: '#333', marginBottom: 20 },
  loading: { textAlign: 'center', padding: 50 },
  alertsList: { display: 'flex', flexDirection: 'column', gap: 15 },
  emptyState: { textAlign: 'center', padding: 50, background: 'white', borderRadius: 10 },
  emptyEmoji: { fontSize: 64, marginBottom: 20 },
  alertCard: { padding: 20, borderRadius: 10, borderLeftWidth: 4, borderLeftStyle: 'solid', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  alertHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  alertSeverity: { fontWeight: 'bold', fontSize: 16 },
  alertStatus: { fontSize: 12, fontStyle: 'italic' },
  alertMessage: { marginBottom: 10 },
  alertDate: { fontSize: 12, color: '#666', marginBottom: 15 },
  alertButtons: { display: 'flex', gap: 10 },
  acknowledgeBtn: { background: '#ff9800', color: 'white', border: 'none', padding: '8px 15px', borderRadius: 5, cursor: 'pointer' },
  resolveBtn: { background: '#4caf50', color: 'white', border: 'none', padding: '8px 15px', borderRadius: 5, cursor: 'pointer' },
};

export default Alerts;